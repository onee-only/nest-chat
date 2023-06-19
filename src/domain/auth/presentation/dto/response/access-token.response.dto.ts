import { CookieDto } from 'src/global/interceptors/cookie';

type AccessTokenResponseDtoParams = {
    accessToken: string;
    exp: number;
    cookies: Map<string, string>;
};

export class AccessTokenResponseDto extends CookieDto {
    constructor(
        public readonly accessToken: string,
        public readonly exp: number,
        public readonly cookies: Map<string, string>,
    ) {
        super(cookies);
    }

    public static from(
        params: AccessTokenResponseDtoParams,
    ): AccessTokenResponseDto {
        return new AccessTokenResponseDto(
            params.accessToken,
            params.exp,
            params.cookies,
        );
    }
}
