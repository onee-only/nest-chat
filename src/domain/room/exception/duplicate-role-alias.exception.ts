import { ConflictException } from '@nestjs/common';

export class DuplicateRoleAliasException extends ConflictException {
    constructor(roomID: number, alias: string) {
        super(`role with alias: ${alias} already exists on room: ${roomID}`);
    }
}
