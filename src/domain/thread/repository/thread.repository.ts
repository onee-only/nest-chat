import { DataSource, Repository } from 'typeorm';
import { Thread } from '../entity';
import { ListOptions } from '../query';
import { ListThreadElementDto } from '../presentation/dto/internal';
import { Message } from 'src/domain/message/entity';

type ListResult = {
    list: ListThreadElementDto[];
    count: number;
};

export class ThreadRepository extends Repository<Thread> {
    constructor(private readonly dataSource: DataSource) {
        super(Thread, dataSource.createEntityManager());
    }

    async findList(options: ListOptions): Promise<ListResult> {
        const {
            roomID,
            order,
            orderDir,
            endDate,
            startDate,
            query,
            tags,
            page = 1,
            size = 20,
        } = options;

        const qb = this.createQueryBuilder('thread')
            .where('thread.roomId = :roomID', { roomID })
            .andWhere(this.optional(query, 'thread.name like :query'), {
                query: `%${query}%`,
            })
            .andWhere(this.optional(endDate, 'thread.createdAt <= :endDate'), {
                endDate,
            })
            .andWhere(
                this.optional(startDate, 'thread.createdAt >= :endDate'),
                { startDate },
            )
            .andWhere(this.optional(tags, 'thread.tags IN (:tags)'), {
                tags,
            });

        const count = await qb.getCount();

        const list = await qb
            .select('thread.*')
            .addSelect('count(*)', 'count')
            .addSelect((subquery) =>
                subquery
                    .select(
                        'distinct count(message.authorId)',
                        'participantCount',
                    )
                    .addSelect('count(*)', 'messageCount')
                    .from(Message, 'message')
                    .where('message.threadId = thread.id'),
            )
            .innerJoinAndSelect('thread.creator', 'creator')
            .orderBy(order, orderDir)
            .offset(size * (page - 1))
            .limit(size)
            .getRawMany<ListThreadElementDto>();

        return {
            count,
            list,
        };
    }

    private optional(thing: any, query: string): string {
        return thing ? query : '1=1';
    }
}
