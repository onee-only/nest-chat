import { ForbiddenException } from '@nestjs/common';

export class UnVerifiedEamilException extends ForbiddenException {
    constructor() {
        super('your email is not verified');
    }
}
