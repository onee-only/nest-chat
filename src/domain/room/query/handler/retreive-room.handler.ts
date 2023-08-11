import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetreiveRoomQuery } from '../retreive-room.query';
import { RoomRepository } from '../../repository';
import { PermissionChecker } from '../../util';
import { RoomNotFoundException } from '../../exception';
import { RetreiveRoomResponse } from '../../presentation/dto/response';

@QueryHandler(RetreiveRoomQuery)
export class RetreiveRoomHandler implements IQueryHandler<RetreiveRoomQuery> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(query: RetreiveRoomQuery): Promise<RetreiveRoomResponse> {
        const { roomID, user } = query;

        const room = await this.roomRepository
            .findOneOrFail({
                where: { id: roomID },
                relations: { owner: true, tags: true },
            })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        await this.permissionChecker.checkOrThrow({
            room,
            user,
        });

        return RetreiveRoomResponse.from(room);
    }
}
