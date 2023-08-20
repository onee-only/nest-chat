import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPinnedThreadQuery } from '../list-pinned-thread.query';
import { ListThreadReponseDto } from '../../presentation/dto/response';
import { RoomRepository } from 'src/domain/room/repository';
import { PermissionChecker } from 'src/domain/room/util';
import { PinnedThreadRepository } from '../../repository';
import { RoomNotFoundException } from 'src/domain/room/exception';

@QueryHandler(ListPinnedThreadQuery)
export class ListPinnedThreadHandler
    implements IQueryHandler<ListPinnedThreadQuery>
{
    constructor(
        public readonly roomRepository: RoomRepository,
        private readonly pinnedThreadRepository: PinnedThreadRepository,
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
            await this.pinnedThreadRepository.findList(roomID);

        return ListThreadReponseDto.from(threadList, {
            pageNum: 1,
            pageSize: threadList.length,
            totalPages: Math.ceil(count / threadList.length) || 0,
            totalThreads: count,
        });
    }
}
