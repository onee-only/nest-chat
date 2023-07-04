import { ConflictException } from '@nestjs/common';

export class AlreadyJoinedException extends ConflictException {
    constructor() {
        super('you have already joined this room');
    }
}
