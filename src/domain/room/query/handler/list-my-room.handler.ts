import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMyRoomQuery } from '../list-my-room.query';
import { ListMyRoomResponse } from '../../presentation/dto/response';
import { RoomRepository } from '../../repository';

@QueryHandler(ListMyRoomQuery)
export class ListMyRoomHandler implements IQueryHandler<ListMyRoomQuery> {
    constructor(private readonly roomRepository: RoomRepository) {}

    async execute(query: ListMyRoomQuery): Promise<ListMyRoomResponse> {
        const { user } = query;

        const rooms = await this.roomRepository.find({
            where: { members: { userID: user.id } },
        });

        return ListMyRoomResponse.from(rooms, user);
    }
}
