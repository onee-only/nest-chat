import { ICommandHandler } from '@nestjs/cqrs';
import { LoginQuery } from '../login.query';
import { UserRepository } from 'src/domain/user/repository';
import { AccessTokenResponseDto } from '../../presentation/dto/response';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtConfig, JwtConfig } from 'src/global/config';
import { TokenPayload } from 'src/global/strategies/jwt/payloads/token.payload';

export class LoginHandler implements ICommandHandler<LoginQuery> {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
    ) {}
    async execute(command: LoginQuery): Promise<AccessTokenResponseDto> {
        const { email, password } = command;

        const userID = await this.userRepository.findIdByEmailAndPassword(
            email,
            password,
        );

        const payload: TokenPayload = { userID };
        const { access, refresh } = this.configService.get<IJwtConfig>(
            JwtConfig.KEY,
        );

        // create accessToken
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: access.expiration,
            secret: access.secret,
        });

        // create refreshToken
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: refresh.expiration,
            secret: refresh.secret,
        });
        const cookies = new Map().set('refreshToken', refreshToken);

        return AccessTokenResponseDto.from({
            accessToken: accessToken,
            exp: access.expiration,
            cookies: cookies,
        });
    }
}
