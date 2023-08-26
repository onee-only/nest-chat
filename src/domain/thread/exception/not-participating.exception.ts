import { ForbiddenException } from '@nestjs/common';

export class NotParticipatingException extends ForbiddenException {
    constructor() {
        super('you cannot write a message without participating the chat');
    }
}
