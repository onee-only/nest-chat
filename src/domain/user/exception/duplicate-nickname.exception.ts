import { ConflictException } from '@nestjs/common';

export class DuplicateNicknameException extends ConflictException {
    constructor(nickname: string) {
        super(`user with nickname: ${nickname} already exists`);
    }
}
