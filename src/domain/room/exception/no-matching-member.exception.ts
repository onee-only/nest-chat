import { NotFoundException } from '@nestjs/common';

export class NoMatchingMemberException extends NotFoundException {
    constructor(roomID: number, memberID: number) {
        super(
            `member: ${memberID} does not exist or is not a property of room: ${roomID}`,
        );
    }
}
