import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MemberRole, Room, RoomMember } from '../entity';

@Injectable()
export class RoomMemberRepository extends Repository<RoomMember> {
    constructor(private readonly dataSource: DataSource) {
        super(RoomMember, dataSource.createEntityManager());
    }

    async existsByRoomAndRole(room: Room, role: MemberRole): Promise<boolean> {
        return await this.exist({ where: { role, room } });
    }

    async findWithAvatarByRoom(room: Room): Promise<RoomMember[]> {
        return await this.find({
            relations: { role: true, user: { avatar: true } },
            select: {
                id: true,
                role: { alias: true, id: true },
                user: {
                    id: true,
                    avatar: { nickname: true, profileURL: true },
                },
            },
            where: { room },
        });
    }
}
