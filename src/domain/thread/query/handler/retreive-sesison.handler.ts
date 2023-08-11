import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetreiveSessionQuery } from '../retreive-session.query';
import { RetreiveSessionResponseDto } from '../../presentation/dto/response';
import { ChatInfoManager } from '../../util/chat';
import { RoomRepository } from 'src/domain/room/repository';
import { PermissionChecker } from 'src/domain/room/util';
import { RoomNotFoundException } from 'src/domain/room/exception';

@QueryHandler(RetreiveSessionQuery)
export class RetreiveSessionHandler
    implements IQueryHandler<RetreiveSessionQuery>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly permissionChecker: PermissionChecker,

        private readonly chatInfoManager: ChatInfoManager,
    ) {}

    async execute(
        query: RetreiveSessionQuery,
    ): Promise<RetreiveSessionResponseDto> {
        const { roomID, threadID, user } = query;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        await this.permissionChecker.checkOrThrow({
            room,
            user,
        });

        const chatInfo = await this.chatInfoManager.getChatInfo(
            roomID,
            threadID,
        );

        return RetreiveSessionResponseDto.from(chatInfo);
    }
}
