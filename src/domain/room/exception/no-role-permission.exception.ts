import { ForbiddenException } from '@nestjs/common';
import { RoomPermission } from '../enum';

export class NoRolePermissionException extends ForbiddenException {
    constructor(roomID: number, action: RoomPermission) {
        super(`you don't have the permission to: ${action} in room: ${roomID}`);
    }
}
