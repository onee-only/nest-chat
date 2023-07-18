import { LoggerService, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { WsJwtGuard } from 'src/global/guards/ws';
import { ChatBroker } from '../util/chat';

@UseGuards(WsJwtGuard)
@WebSocketGateway(3001, {
    path: 'rooms/:roomID/threads/:threadID/chat',
    cors: { origin: '*' },
})
export class ChatGateway
    implements
        OnGatewayConnection<Socket>,
        OnGatewayDisconnect<Socket>,
        OnGatewayInit<Server>
{
    constructor(
        private readonly logger: LoggerService,
        private readonly chatBroker: ChatBroker,
    ) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('typing')
    async handleEvent(@ConnectedSocket() socket: Socket) {
        await this.chatBroker.broadcastTyping(socket);
    }

    async handleConnection(
        @ConnectedSocket() socket: Socket,
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @GetUser() user: User,
    ) {
        await this.chatBroker.join(socket, user, roomID, threadID);
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        await this.chatBroker.leave(socket);
    }

    afterInit(server: Server) {
        this.logger.log(`Socket is live!`);
    }
}
