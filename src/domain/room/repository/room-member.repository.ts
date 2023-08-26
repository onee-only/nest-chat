import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { MemberRole, Room, RoomMember } from '../entity';

@Injectable()
export class RoomMemberRepository extends Repository<RoomMember> {
    constructor(private readonly dataSource: DataSource) {
        super(RoomMember, dataSource.createEntityManager());
    }

    async existsByRoomAndRole(room: Room, role: MemberRole): Promise<boolean> {
        return await this.exist({ where: { role, roomID: room.id } });
    }

    async findWithAvatarByRoom(room: Room): Promise<RoomMember[]> {
        return await this.find({
            relations: { role: true, user: { avatar: true } },
            select: {
                role: { alias: true },
                user: {
                    id: true,
                    avatar: { nickname: true, profileURL: true },
                },
            },
            where: { roomID: room.id },
        });
    }

    async findByRoomAndUserNicknames(
        room: Room,
        nicknames: string[],
    ): Promise<RoomMember[]> {
        return await this.findBy({
            room,
            user: { avatar: { nickname: In(nicknames) } },
        });
    }
}
