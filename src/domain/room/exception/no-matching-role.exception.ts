import { NotFoundException } from '@nestjs/common';

export class NoMatchingRoleException extends NotFoundException {
    constructor(roomID: number, alias: string) {
        super(
            `role: ${alias} doesn't exist or is not a property of room: ${roomID}`,
        );
    }
}
