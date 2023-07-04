import { DataSource, Repository } from 'typeorm';
import { PinnedThread, Thread } from '../entity';
import { ListThreadElementDto } from '../presentation/dto/internal';
import { Message } from 'src/domain/message/entity';

type ListResult = {
    list: ListThreadElementDto[];
    count: number;
};

export class PinnedThreadRepository extends Repository<PinnedThread> {
    constructor(private readonly dataSource: DataSource) {
        super(PinnedThread, dataSource.createEntityManager());
    }

    async findList(roomID: number): Promise<ListResult> {
        const qb = this.createQueryBuilder('pinnedThread')
            .where('thread.roomId = :roomID', { roomID })
            .innerJoinAndSelect(Thread, 'thread');

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
            .getRawMany<ListThreadElementDto>();

        return {
            count,
            list,
        };
    }
}
