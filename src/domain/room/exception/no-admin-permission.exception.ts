import { ForbiddenException } from '@nestjs/common';

export class NoAdminPermissionException extends ForbiddenException {
    constructor() {
        super('you should be an admin for this action');
    }
}
