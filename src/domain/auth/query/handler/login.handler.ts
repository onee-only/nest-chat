import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginQuery } from '../login.query';
import { UserRepository } from 'src/domain/user/repository';
import { AccessTokenResponse } from '../../presentation/dto/response';
import { JwtProvider, PasswordManager } from '../../util';
import {
    InvalidCredentialsException,
    UnVerifiedEamilException,
} from '../../exception';
import { TokenPayload } from 'src/global/modules/strategy/jwt/payloads';

@QueryHandler(LoginQuery)
export class LoginHandler implements IQueryHandler<LoginQuery> {
    constructor(
        private readonly jwtProvider: JwtProvider,
        private readonly passwordManager: PasswordManager,

        private readonly userRepository: UserRepository,
    ) {}
    async execute(query: LoginQuery): Promise<AccessTokenResponse> {
        const { email, password } = query;

        const user = await this.userRepository
            .findOneByOrFail({ email })
            .catch(() => {
                throw new InvalidCredentialsException();
            });

        if (await this.isPasswordInCorrect(password, user.password)) {
            throw new InvalidCredentialsException();
        }

        if (!user.isVerified) {
            throw new UnVerifiedEamilException();
        }

        const payload: TokenPayload = { userID: user.id };

        const accessToken = await this.jwtProvider.provideAccess(payload);
        const refreshToken = await this.jwtProvider.provideRefresh(payload);

        const exp = Date.now() + this.jwtProvider.getAccessExpiration() * 1000;
        const cookies = new Map().set('refreshToken', refreshToken);

        return AccessTokenResponse.from({
            accessToken,
            exp,
            cookies,
        });
    }

    async isPasswordInCorrect(
        candidate: string,
        password: string,
    ): Promise<boolean> {
        const isCorrect = await this.passwordManager.compare(
            password,
            candidate,
        );
        return !isCorrect;
    }
}
