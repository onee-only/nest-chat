import { ForbiddenException } from '@nestjs/common';

export class NotRoomMemberException extends ForbiddenException {
    constructor(userID: number, roomID: number) {
        super(`user: ${userID} is not a member of room: ${roomID}`);
    }
}
