import { NotFoundException } from '@nestjs/common';

export class NoMatchingInvitationException extends NotFoundException {
    constructor(roomID: number, token: string) {
        super(
            `invitation: ${token} does not exist or is not a property of room: ${roomID}`,
        );
    }
}
