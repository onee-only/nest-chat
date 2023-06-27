import { Injectable } from '@nestjs/common';
import { RoomMemberRepository } from '../repository';
import { NoAdminPermissionException } from '../exception';
import { Room } from '../entity';
import { User } from 'src/domain/user/entity';

@Injectable()
export class RoomAdminChecker {
    constructor(private readonly roomMemberRepository: RoomMemberRepository) {}

    /**
     * checks if given user is the admin of the given room
     */
    async check(room: Room, user: User): Promise<boolean> {
        return await this.doCheck(room, user);
    }

    /**
     * throws error if given user is not the admin of the given room
     * @throws NoAdminPermissionException
     */
    async checkOrThrow(room: Room, user: User): Promise<void> {
        const isAdmin = await this.doCheck(room, user);
        if (!isAdmin) {
            throw new NoAdminPermissionException();
        }
    }

    private async doCheck(room: Room, user: User): Promise<boolean> {
        return await this.roomMemberRepository.checkIsAdmin(room, user);
    }
}
