import { BadRequestException } from '@nestjs/common';

export class InvalidEmailTokenException extends BadRequestException {
    constructor() {
        super('the token is invalid');
    }
}
