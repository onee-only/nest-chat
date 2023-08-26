import { ForbiddenException } from '@nestjs/common';

export class InvalidInvitationTokenException extends ForbiddenException {
    constructor(roomID: number, token: string) {
        super(`given token: ${token} is not valid for room: ${roomID}`);
    }
}
