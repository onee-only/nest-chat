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
        return await this.exist({ where: { roomID: room.id, alias } });
    }

    async findWithMemberCountByRoom(room: Room): Promise<RoleElement[]> {
        const results = await this.createQueryBuilder('role')
            .select('role.*')
            .addSelect(
                (subquery) =>
                    subquery
                        .select('count(*)')
                        .from(RoomMember, 'roomMember')
                        .where('roomMember.roleAlias = role.alias')
                        .andWhere('roomMember.roomID = role.roomID'),
                'memberCount',
            )
            .addSelect(
                (subquery) =>
                    subquery
                        .select('count(*) > 0')
                        .from(Room, 'room')
                        .where('room.id = role.roomID')
                        .andWhere('role.alias = room.defaultRoleAlias'),
                'isDefault',
            )
            .where('role.roomID = :roomID', { roomID: room.id })
            .getRawMany();

        return results.map(
            (result): RoleElement => ({
                id: result.id,
                alias: result.alias,
                isDefault: Boolean(result.isDefault),
                memberCount: result.memberCount,
                permission: {
                    createThread: Boolean(result.permissionCreatethread),
                    deleteMessage: Boolean(result.permissionDeletemessage),
                    inviteMember: Boolean(result.permissionInvitemember),
                    kickMember: Boolean(result.permissionKickmember),
                    manageRole: Boolean(result.permissionManagerole),
                    manageTag: Boolean(result.permissionManagetag),
                    writeMessage: Boolean(result.permissionWritemessage),
                },
            }),
        );
    }

    async findByRoomAndAliases(
        room: Room,
        names: string[],
    ): Promise<MemberRole[]> {
        return await this.findBy({ room, alias: In(names) });
    }
}
