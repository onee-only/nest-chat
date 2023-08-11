import { CookieDto } from 'src/global/interceptors/cookie';

type AccessTokenResponseParams = {
    accessToken: string;
    exp: number;
    cookies: Map<string, string>;
};

export class AccessTokenResponse extends CookieDto {
    constructor(
        public readonly accessToken: string,
        public readonly exp: number,
        public readonly cookies: Map<string, string>,
    ) {
        super(cookies);
    }

    public static from(params: AccessTokenResponseParams): AccessTokenResponse {
        return new AccessTokenResponse(
            params.accessToken,
            params.exp,
            params.cookies,
        );
    }
}
