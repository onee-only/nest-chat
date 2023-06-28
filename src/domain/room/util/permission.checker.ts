import { Injectable } from '@nestjs/common';
import { RoomMemberRepository } from '../repository';
import { Permission, Room } from '../entity';
import { User } from 'src/domain/user/entity';
import { RoomPermission } from '../enum';
import {
    NoRolePermissionException,
    NotRoomMemberException,
} from '../exception';

@Injectable()
export class PermissionChecker {
    constructor(private readonly roomMemberRepository: RoomMemberRepository) {}

    /**
     * checks the user permission
     */
    async checkAvailable(
        room: Room,
        user: User,
        action: RoomPermission,
    ): Promise<boolean> {
        return await this.check(room, user, action);
    }

    /**
     * checks the user permission and throws
     * @throws NoRolePermissionException
     */
    async checkAvailableOrThrow(
        room: Room,
        user: User,
        action: RoomPermission,
    ): Promise<void> {
        const available = await this.check(room, user, action);
        if (!available) {
            throw new NoRolePermissionException(room.id, action);
        }
    }

    private async check(
        room: Room,
        user: User,
        action: RoomPermission,
    ): Promise<boolean> {
        const member = await this.roomMemberRepository.findOne({
            relations: { role: true },
            where: { room, user },
        });

        if (member == null) {
            throw new NotRoomMemberException(user.id, room.id);
        }
        return this.checkAllowed(member.role.permission, action);
    }

    private checkAllowed(
        permission: Permission,
        action: RoomPermission,
    ): boolean {
        return Boolean(
            Object.entries(permission).filter(
                ([key, value]) => key === action && value,
            ),
        );
    }
}
