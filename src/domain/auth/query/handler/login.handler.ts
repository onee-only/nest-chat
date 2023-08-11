import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginQuery } from '../login.query';
import { UserRepository } from 'src/domain/user/repository';
import { AccessTokenResponse } from '../../presentation/dto/response';
import { JwtProvider } from '../../util';
import { InvalidCredentialsException } from '../../exception';
import { TokenPayload } from 'src/global/modules/strategy/jwt/payloads';

@QueryHandler(LoginQuery)
export class LoginHandler implements IQueryHandler<LoginQuery> {
    constructor(
        private readonly jwtProvider: JwtProvider,
        private readonly userRepository: UserRepository,
    ) {}
    async execute(query: LoginQuery): Promise<AccessTokenResponse> {
        const { email, password } = query;

        const userID = await this.userRepository.findIdByEmailAndPassword(
            email,
            password,
        );

        if (userID == null) {
            throw new InvalidCredentialsException();
        }

        const payload: TokenPayload = { userID };

        const accessToken = await this.jwtProvider.provideAccess(payload);
        const refreshToken = await this.jwtProvider.provideRefresh(payload);

        const exp = this.jwtProvider.getAccessExpiration();
        const cookies = new Map().set('refreshToken', refreshToken);

        return AccessTokenResponse.from({
            accessToken,
            exp,
            cookies,
        });
    }
}
