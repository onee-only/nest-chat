import { DataSource, Repository } from 'typeorm';
import { Thread } from '../entity';
import { ListOptions } from '../query';
import { ListThreadElement } from '../presentation/dto/internal';
import { Message } from 'src/domain/message/entity';
import { Injectable } from '@nestjs/common';

type ListResult = {
    list: ListThreadElement[];
    count: number;
};

@Injectable()
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
            .andWhere(this.optional(tags, 'thread.tags IN (:tags)'), { tags })
            .andWhere(this.optional(query, 'thread.name like :query'), {
                query: `%${query}%`,
            })
            .andWhere(this.optional(endDate, 'thread.createdAt <= :endDate'), {
                endDate,
            })
            .andWhere(
                this.optional(startDate, 'thread.createdAt >= :endDate'),
                { startDate },
            );

        const count = await qb.getCount();

        const results = await qb
            .select('thread.*')
            .addSelect('count(*)', 'count')
            .addSelect(
                (subquery) =>
                    subquery
                        .select('count(distinct message.authorId)')
                        .from(Message, 'message')
                        .where('message.threadId = thread.id'),
                'participantCount',
            )
            .addSelect(
                (subquery) =>
                    subquery
                        .select('count(*)')
                        .from(Message, 'message')
                        .where('message.threadId = thread.id'),
                'messageCount',
            )
            .addSelect(['creator.id', 'avatar.nickname', 'avatar.profileURL'])
            .leftJoin('thread.creator', 'creator')
            .leftJoin('creator.avatar', 'avatar')
            .groupBy('thread.id')
            .addGroupBy('creator.id')
            .addGroupBy('avatar.nickname')
            .orderBy(order, orderDir)
            .offset(size * (page - 1))
            .limit(size)
            .getRawMany();

        const threadTags = await this.getThreadTags(
            results.map((result) => result.id),
        );

        const list = results.map(
            (result): ListThreadElement => ({
                id: result.id,
                title: result.title,
                createdAt: result.createdAt,
                messageCount: result.messageCount,
                participantCount: result.participantCount,
                creator: {
                    id: result.creator_id,
                    nickname: result.avatar_nickname,
                    profileURL: result.avatar_profileURL,
                },
                tags: threadTags.get(result.id) || [],
            }),
        );

        return {
            count,
            list,
        };
    }

    private optional(thing: any, query: string): string {
        return thing ? query : '1=1';
    }

    private async getThreadTags(ids: number[]): Promise<Map<number, string[]>> {
        const threadTags: Map<number, string[]> = new Map<number, string[]>();

        if (ids.length > 0) {
            const results = await this.dataSource
                .createQueryBuilder()
                .select(['threadID', 'tagName'])
                .from('thread_tags', 'threadTags')
                .where('threadID IN (:ids)', { ids })
                .getRawMany();

            results.forEach((result) => {
                threadTags.set(result.threadID, [
                    ...(threadTags.get(result.threadID) || []),
                    result.tagName,
                ]);
            });
        }

        return threadTags;
    }
}
