import { ConflictException } from '@nestjs/common';

export class RoleOccupiedException extends ConflictException {
    constructor() {
        super('roles is used by room members. should not be deleted');
    }
}
