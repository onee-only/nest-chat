import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Room, RoomMember } from '../entity';
import { User } from 'src/domain/user/entity';
import { ListOptions } from '../query';
import { RoomListElement } from '../presentation/dto/internal';

type ListResult = {
    list: RoomListElement[];
    count: number;
};

@Injectable()
export class RoomRepository extends Repository<Room> {
    constructor(private readonly dataSource: DataSource) {
        super(Room, dataSource.createEntityManager());
    }

    async findList(user: User, options: ListOptions): Promise<ListResult> {
        const {
            order,
            orderDir,
            endDate,
            startDate,
            query,
            tags,
            page = 1,
            size = 20,
        } = options;

        const qb = this.createQueryBuilder('room')
            .where('room.isPublic = true')
            .andWhere(this.optional(query, 'room.name like :query'), {
                query: `%${query}%`,
            })
            .andWhere(this.optional(endDate, 'room.createdAt <= :endDate'), {
                endDate,
            })
            .andWhere(this.optional(startDate, 'room.createdAt >= :endDate'), {
                startDate,
            })
            .andWhere(this.optional(tags, 'room.tags IN (:tags)'), {
                tags: tags,
            });

        const count = await qb.getCount();

        const results = await qb
            .select('room.*')
            .addSelect(
                (subquery) =>
                    subquery
                        .select('count(*) > 0')
                        .from(RoomMember, 'roomMember')
                        .where('roomMember.userID = :userID')
                        .andWhere('roomMember.roomId = room.id')
                        .setParameter('userID', user.id),
                'isMember',
            )
            .addSelect(
                (subquery) =>
                    subquery
                        .select('count(*)')
                        .from(RoomMember, 'roomMember')
                        .where('roomMember.roomId = room.id'),
                'memberCount',
            )
            .addSelect(['owner.id', 'avatar.nickname', 'avatar.profileURL'])
            .innerJoin('room.owner', 'owner')
            .leftJoin('owner.avatar', 'avatar', 'owner.id = avatar.userID')
            .orderBy(order, orderDir)
            .offset(size * (page - 1))
            .limit(size)
            .getRawMany();

        const list = results.map(
            (result): RoomListElement => ({
                id: result.id,
                name: result.name,
                profileURL: result.name,
                description: result.description,
                createdAt: result.createdAt,
                owner: {
                    id: result.owner_id,
                    nickname: result.avatar_nickname,
                    profileURL: result.avatar_profileURL,
                },
                isMember: Boolean(result.isMember),
                memberCount: result.memberCount,
            }),
        );

        return {
            list,
            count,
        };
    }

    private optional(thing: any, query: string): string {
        return thing ? query : '1=1';
    }
}
