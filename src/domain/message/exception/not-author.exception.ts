import { ForbiddenException } from '@nestjs/common';

export class NotAuthorException extends ForbiddenException {
    constructor() {
        super('you are not allowed to mutate this message');
    }
}
