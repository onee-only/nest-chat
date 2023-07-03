import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListThreadQuery } from '../list-thread.query';
import { ListThreadReponseDto } from '../../presentation/dto/response';
import { RoomRepository } from 'src/domain/room/repository';
import { PermissionChecker } from 'src/domain/room/util';
import { ThreadRepository } from '../../repository';
import { RoomNotFoundException } from 'src/domain/room/exception';

@QueryHandler(ListThreadQuery)
export class ListThreadHandler implements IQueryHandler<ListThreadQuery> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(query: ListThreadQuery): Promise<ListThreadReponseDto> {
        const { user, options } = query;

        const room = await this.roomRepository
            .findOneByOrFail({ id: options.roomID })
            .catch(() => {
                throw new RoomNotFoundException(options.roomID);
            });

        await this.permissionChecker.checkOrThrow({
            room,
            user,
        });

        const { count, list: threadList } =
            await this.threadRepository.findList(user, options);

        return ListThreadReponseDto.from(threadList, {
            pageNum: options.page,
            pageSize: threadList.length,
            totalPages: Math.ceil(count / threadList.length),
            totalThreads: count,
        });
    }
}
