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
    action?: RoomPermission;
};

@Injectable()
export class PermissionChecker {
    constructor(private readonly roomMemberRepository: RoomMemberRepository) {}

    /**
     * checks the user permission. action is optional
     */
    async check({ action, room, user }: Params): Promise<boolean> {
        return await this.doCheck(room, user, action);
    }

    /**
     * checks the user permission and throws. action is optional
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
        action?: RoomPermission,
    ): Promise<boolean> {
        const member = await this.roomMemberRepository
            .findOneOrFail({
                relations: { role: true },
                where: { roomID: room.id, userID: user.id },
            })
            .catch(() => {
                throw new NotRoomMemberException(user.id, room.id);
            });

        return action == null ? true : member.role.permission[action] == true;
    }
}
