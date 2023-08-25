import { ForbiddenException } from '@nestjs/common';

export class LeavingAsOwnerException extends ForbiddenException {
    constructor() {
        super('owner cannot leave the room');
    }
}
