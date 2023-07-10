import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageParser {
    private readonly regex = /\B@\w+/g;

    parse(body: string): string[] {
        return body.match(this.regex).map((result) => result.replace('@', ''));
    }
}
