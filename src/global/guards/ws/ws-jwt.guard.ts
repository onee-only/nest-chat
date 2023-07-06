import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UserRepository } from 'src/domain/user/repository';
import { IJwtConfig, JwtConfig } from 'src/global/modules/strategy/jwt';
import { TokenPayload } from 'src/global/modules/strategy/jwt/payloads';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient<Socket>();

        const authorization: string = client.handshake?.headers.authorization;
        const accessToken = this.getToken(authorization);

        const secret = this.configService.get<IJwtConfig>(JwtConfig.KEY).access
            .secret;

        const { userID }: TokenPayload = this.jwtService.verify(accessToken, {
            secret,
        });

        const user = await this.userRepository.findOneBy({ id: userID });
        context.switchToHttp().getRequest().user = user;

        return user != null;
    }

    private getToken(authorization: string): string {
        const splitted = authorization.split(' ');
        if (splitted.length < 2) {
            return '';
        }
        return splitted[1];
    }
}
