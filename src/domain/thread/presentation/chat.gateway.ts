import { Logger, UseFilters } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatBroker } from '../util/chat';
import { WsExceptionFilter } from 'src/global/filters';
import { UserRepository } from 'src/domain/user/repository';
import { JwtService } from '@nestjs/jwt';
import { IJwtConfig, JWT_CONFIG } from 'src/global/modules/strategy/jwt';
import { TokenPayload } from 'src/global/modules/strategy/jwt/payloads';
import { SocketData } from '../util/chat/types';
import { ConfigService } from '@nestjs/config';

@UseFilters(WsExceptionFilter)
@WebSocketGateway({
    path: '/v1/chat',
    cors: {
        origin: '*',
        methods: '*',
    },
    transports: ['websocket'],
})
export class ChatGateway
    implements
        OnGatewayConnection<Socket>,
        OnGatewayDisconnect<Socket>,
        OnGatewayInit<Server>
{
    constructor(
        private readonly logger: Logger,
        private readonly chatBroker: ChatBroker,

        // should refactor auth logic.. put it on other provider or something.
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    private jwtSecret: string;

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('join')
    async handleJoin(
        @ConnectedSocket() socket: Socket,
        @MessageBody()
        request: {
            roomID: number;
            threadID: number;
        },
    ) {
        const socketData: SocketData = socket.data;
        await this.chatBroker.join(
            socket,
            socketData.userID,
            request.roomID,
            request.threadID,
        );
    }

    @SubscribeMessage('typing')
    async handleTyping(@ConnectedSocket() socket: Socket) {
        await this.chatBroker.broadcastTyping(socket);
    }

    async handleConnection(@ConnectedSocket() socket: Socket) {
        // should refactor it

        const authorization: string = socket.handshake?.headers.authorization;
        const accessToken = authorization?.startsWith('Bearer ')
            ? authorization.split(' ')[1]
            : null;

        let id: number;
        try {
            const { userID }: TokenPayload = this.jwtService.verify(
                accessToken,
                {
                    secret: this.jwtSecret,
                },
            );
            id = userID;
        } catch (_) {
            socket.emit('error', 'your token is not valid');
            socket.disconnect(true);
            return;
        }

        const user = await this.userRepository.findOne({
            where: { id: id },
            select: { id: true },
        });

        const data: SocketData = {
            userID: user.id,
            roomID: null,
            threadID: null,
        };
        socket.data = data;
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        await this.chatBroker.leave(socket);
    }

    afterInit(server: Server) {
        this.logger.log(`Socket is live!`);

        this.jwtSecret =
            this.configService.get<IJwtConfig>(JWT_CONFIG).access.secret;
    }
}
