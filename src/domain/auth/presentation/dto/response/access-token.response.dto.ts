import { ApiProperty } from '@nestjs/swagger';
import { CookieDto } from 'src/global/interceptors/cookie';

type AccessTokenResponseParams = {
    accessToken: string;
    exp: number;
    cookies: Map<string, string>;
};

export class AccessTokenResponse extends CookieDto {
    @ApiProperty()
    public readonly accessToken: string;

    @ApiProperty()
    public readonly exp: number;

    @ApiProperty()
    public readonly cookies: Map<string, string>;

    constructor(
        accessToken: string,
        exp: number,
        cookies: Map<string, string>,
    ) {
        super(cookies);
        this.accessToken = accessToken;
        this.exp = exp;
    }

    public static from(params: AccessTokenResponseParams): AccessTokenResponse {
        return new AccessTokenResponse(
            params.accessToken,
            params.exp,
            params.cookies,
        );
    }
}
