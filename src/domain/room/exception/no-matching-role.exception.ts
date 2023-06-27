import { NotFoundException } from '@nestjs/common';

export class NoMatchingRoleException extends NotFoundException {
    constructor(roomID: number, roleID: number) {
        super(
            `role: ${roleID} doesn't exist or is not a property of room: ${roomID}`,
        );
    }
}
