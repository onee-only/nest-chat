import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListRoomQuery } from '../list-room.query';
import { ListRoomResponseDto } from '../../presentation/dto/response';
import { RoomRepository } from '../../repository';

@QueryHandler(ListRoomQuery)
export class ListRoomHandler implements IQueryHandler<ListRoomQuery> {
    constructor(private readonly roomRepository: RoomRepository) {}

    async execute(query: ListRoomQuery): Promise<ListRoomResponseDto> {
        const { user, options } = query;

        const { count, list: roomList } = await this.roomRepository.findList(
            user,
            options,
        );

        return ListRoomResponseDto.from(roomList, {
            pageNum: options.page,
            pageSize: options.size,
            totalPages: Math.ceil(count / options.size),
            totalRooms: count,
        });
    }
}
