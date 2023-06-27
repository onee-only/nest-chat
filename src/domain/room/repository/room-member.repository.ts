import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Room, RoomMember } from '../entity';
import { User } from 'src/domain/user/entity';

@Injectable()
export class RoomMemberRepository extends Repository<RoomMember> {
    constructor(private readonly dataSource: DataSource) {
        super(RoomMember, dataSource.createEntityManager());
    }

    async checkIsAdmin(room: Room, user: User): Promise<boolean> {
        return await this.exist({ where: { user, room, isAdmin: true } });
    }
}
