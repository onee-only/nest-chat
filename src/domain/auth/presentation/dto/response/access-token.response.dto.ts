import { CookieDto } from 'src/global/interceptors/cookie';

export class AccessTokenResponseDto extends CookieDto {
    accessToken: string;
    exp: number;
}
