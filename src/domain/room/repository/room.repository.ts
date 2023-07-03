import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Room, RoomMember } from '../entity';
import { User } from 'src/domain/user/entity';
import { ListOptions } from '../query';
import { RoomListElementDto } from '../presentation/dto/internal';

type ListResult = {
    list: RoomListElementDto[];
    count: number;
};

@Injectable()
export class RoomRepository extends Repository<Room> {
    constructor(private readonly dataSource: DataSource) {
        super(Room, dataSource.createEntityManager());
    }

    /**
     * finds room with owner. if room does not exist, throws error
     */
    async findOneWithOwnerById(id: number): Promise<Room> {
        return await this.findOneOrFail({
            where: { id },
            relations: { owner: true },
        });
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

        const list = await qb
            .select('room.*')
            .addSelect('count(*)', 'count')
            .addSelect(
                (subquery) =>
                    subquery
                        .select(['user.isMember', 'members.memberCount'])
                        .from(
                            (subquery) =>
                                subquery
                                    .select('count(*) > 0', 'isMember')
                                    .from(RoomMember, 'roomMember')
                                    .where('roomMember.userId = :userID')
                                    .andWhere('roomMember.roomId = room.id'),
                            'user',
                        )
                        .addFrom(
                            (subquery) =>
                                subquery
                                    .select('count(*)', 'memberCount')
                                    .from(RoomMember, 'roomMember')
                                    .where('roomMember.userId = :userID'),
                            'members',
                        )
                        .setParameter('userID', user.id),
                'member',
            )
            .innerJoinAndSelect('room.owner', 'owner')
            .orderBy(order, orderDir)
            .offset(size * (page - 1))
            .limit(size)
            .getRawMany<RoomListElementDto>();

        return {
            list,
            count,
        };
    }

    private optional(thing: any, query: string): string {
        return thing ? query : '1=1';
    }
}
