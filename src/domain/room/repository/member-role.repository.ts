import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { MemberRole, Room, RoomMember } from '../entity';
import { RoleElement } from '../presentation/dto/response';

@Injectable()
export class MemberRoleRepository extends Repository<MemberRole> {
    constructor(private readonly dataSource: DataSource) {
        super(MemberRole, dataSource.createEntityManager());
    }

    async duplicateAliasExists(room: Room, alias: string): Promise<boolean> {
        return await this.exist({ where: { room, alias } });
    }

    async findWithMemberCountByRoom(room: Room): Promise<RoleElement[]> {
        return await this.createQueryBuilder('role')
            .select('role.*')
            .addSelect((subquery) =>
                subquery
                    .select('count(*)', 'memberCount')
                    .from(RoomMember, 'roomMember')
                    .where('roomMember.roleId = role.id'),
            )
            .addSelect((subquery) =>
                subquery
                    .select('count(*) > 0', 'isDefault')
                    .from(Room, 'room')
                    .where('room.id = role.roomId')
                    .andWhere('role.id = room.defaultRoleId'),
            )
            .where('role.roomId = :roomID', { roomID: room.id })
            .getRawMany<RoleElement>();
    }

    async findByRoomAndAliases(
        room: Room,
        names: string[],
    ): Promise<MemberRole[]> {
        return await this.findBy({ room, alias: In(names) });
    }
}
