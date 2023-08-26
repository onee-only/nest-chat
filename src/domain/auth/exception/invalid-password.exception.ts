import { ForbiddenException } from '@nestjs/common';

export class InvalidPasswordException extends ForbiddenException {
    constructor() {
        super('given password is invalid');
    }
}
