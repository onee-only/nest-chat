export class CookieDto {
    constructor(cookies: Map<string, string>) {
        this.cookies = cookies;
    }

    cookies!: Map<string, string>;
}
