import { ConflictException } from '@nestjs/common';

export class DuplicateEmailException extends ConflictException {
    constructor(email: string) {
        super(`user with email: ${email} already exists`);
    }
}
