import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListRoomQuery } from '../list-room.query';
import { ListRoomResponseDto } from '../../presentation/dto/response';
import { RoomRepository } from '../../repository';
import { RoomListElementDto } from '../../presentation/dto/internal';

@QueryHandler(ListRoomQuery)
export class ListRoomHandler implements IQueryHandler<ListRoomQuery> {
    constructor(private readonly roomRepository: RoomRepository) {}

    async execute(query: ListRoomQuery): Promise<ListRoomResponseDto> {
        const { user, options } = query;
        const { count, list } = await this.roomRepository.findList(
            user,
            options,
        );

        const roomList = list.map(
            (result): RoomListElementDto => ({
                id: result.id,
                name: result.name,
                isMember: result.member.isMember,
                memberCount: result.member.count,
                owner: result.owner,
                profileURL: result.profileURL,
                description: result.description,
                createdAt: result.createdAt,
            }),
        );

        return ListRoomResponseDto.from(roomList, {
            pageNum: options.page,
            pageSize: options.size,
            totalPages: Math.ceil(count / options.size),
            totalRooms: count,
        });
    }
}
