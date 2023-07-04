import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPinnedThreadQuery } from '../list-pinned-thread.query';
import { ListThreadReponseDto } from '../../presentation/dto/response';
import { RoomRepository } from 'src/domain/room/repository';
import { PermissionChecker } from 'src/domain/room/util';
import { ThreadRepository } from '../../repository';
import { RoomNotFoundException } from 'src/domain/room/exception';
import { ThreadOrder, ThreadOrderDir } from '../../enum';

@QueryHandler(ListPinnedThreadQuery)
export class ListPinnedThreadHandler
    implements IQueryHandler<ListPinnedThreadQuery>
{
    constructor(
        public readonly roomRepository: RoomRepository,
        public readonly threadRepository: ThreadRepository,
        public readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(query: ListPinnedThreadQuery): Promise<ListThreadReponseDto> {
        const { roomID, user } = query;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        await this.permissionChecker.check({ room, user });

        const { list: threadList, count } =
            await this.threadRepository.findList(user, {
                roomID: room.id,
                order: ThreadOrder.POPULARITY,
                orderDir: ThreadOrderDir.DESC,
                page: 1,
                size: 100,
            });

        return ListThreadReponseDto.from(threadList, {
            pageNum: 1,
            pageSize: threadList.length,
            totalPages: Math.ceil(count / threadList.length),
            totalThreads: count,
        });
    }
}
