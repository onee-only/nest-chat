import { DataSource, Repository } from 'typeorm';
import { PinnedThread, Thread } from '../entity';
import { ListThreadElement } from '../presentation/dto/internal';
import { Message } from 'src/domain/message/entity';
import { Injectable } from '@nestjs/common';

type ListResult = {
    list: ListThreadElement[];
    count: number;
};

@Injectable()
export class PinnedThreadRepository extends Repository<PinnedThread> {
    constructor(private readonly dataSource: DataSource) {
        super(PinnedThread, dataSource.createEntityManager());
    }

    async findList(roomID: number): Promise<ListResult> {
        const qb = this.createQueryBuilder('pinnedThread')
            .where('thread.roomId = :roomID', { roomID })
            .innerJoinAndSelect(Thread, 'thread');

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
