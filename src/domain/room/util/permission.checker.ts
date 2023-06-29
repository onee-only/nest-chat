import { Injectable } from '@nestjs/common';
import { RoomMemberRepository } from '../repository';
import { Room } from '../entity';
import { User } from 'src/domain/user/entity';
import { RoomPermission } from '../enum';
import {
    NoRolePermissionException,
    NotRoomMemberException,
} from '../exception';

type Params = {
    room: Room;
    user: User;
    action: RoomPermission;
};

@Injectable()
export class PermissionChecker {
    constructor(private readonly roomMemberRepository: RoomMemberRepository) {}

    /**
     * checks the user permission
     */
    async check({ action, room, user }: Params): Promise<boolean> {
        return await this.doCheck(room, user, action);
    }

    /**
     * checks the user permission and throws
     * @throws NoRolePermissionException
     */
    async checkOrThrow({ action, room, user }: Params): Promise<void> {
        const available = await this.doCheck(room, user, action);
        if (!available) {
            throw new NoRolePermissionException(room.id, action);
        }
    }

    private async doCheck(
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
        return member.role.permission[action] == true;
    }
}
