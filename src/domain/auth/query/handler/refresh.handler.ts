import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccessTokenResponseDto } from '../../presentation/dto/response';
import { TokenPayload } from 'src/global/strategies/jwt/payloads/token.payload';
import { RefreshQuery } from '../refresh.query';
import { JwtProvider } from '../../util';

@QueryHandler(RefreshQuery)
export class RefreshHandler implements IQueryHandler<RefreshQuery> {
    constructor(private readonly jwtProvider: JwtProvider) {}
    async execute(query: RefreshQuery): Promise<AccessTokenResponseDto> {
        const { user } = query;

        const payload: TokenPayload = { userID: user.id };

        const accessToken = await this.jwtProvider.provideAccess(payload);
        const exp = this.jwtProvider.getAccessExpiration();

        return AccessTokenResponseDto.from({
            accessToken,
            exp,
            cookies: new Map(),
        });
    }
}
