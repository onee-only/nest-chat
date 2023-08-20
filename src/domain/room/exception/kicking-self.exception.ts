import { ForbiddenException } from '@nestjs/common';

export class KickingSelfException extends ForbiddenException {
    constructor() {
        super('you cannot kick yourself');
    }
}
