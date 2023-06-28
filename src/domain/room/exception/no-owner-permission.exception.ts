import { ForbiddenException } from '@nestjs/common';

export class NoOwnerPermissionException extends ForbiddenException {
    constructor() {
        super('you should be an owner for this action');
    }
}
