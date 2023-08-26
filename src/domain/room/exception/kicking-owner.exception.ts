import { ForbiddenException } from '@nestjs/common';

export class KickingOwnerException extends ForbiddenException {
    constructor() {
        super('you cannot kick room owner');
    }
}
