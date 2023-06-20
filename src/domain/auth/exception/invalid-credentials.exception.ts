import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
    constructor() {
        super('invalid email and password');
    }
}
