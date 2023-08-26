import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SubscribeMessageQuery } from '../subscribe-message.query';
import { Observable } from 'rxjs';
import { ChatBroker } from 'src/domain/thread/util/chat';
import { RoomRepository } from 'src/domain/room/repository';
import { ThreadRepository } from 'src/domain/thread/repository';
import { RoomNotFoundException } from 'src/domain/room/exception';
import { NoMathcingThreadException } from 'src/domain/thread/exception';
import { PermissionChecker } from 'src/domain/room/util';
import { MessageEvent } from '@nestjs/common';

@QueryHandler(SubscribeMessageQuery)
export class SubscribeMessageHandler
    implements IQueryHandler<SubscribeMessageQuery>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,

        private readonly chatBroker: ChatBroker,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(
        query: SubscribeMessageQuery,
    ): Promise<Observable<MessageEvent>> {
        const { roomID, threadID, user } = query;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        const thread = await this.threadRepository
            .findOneByOrFail({ id: threadID })
            .catch(() => {
                throw new NoMathcingThreadException(roomID, threadID);
            });

        await this.permissionChecker.checkOrThrow({
            room,
            user,
        });

        return await this.chatBroker.subscribe(user, room.id, thread.id);
    }
}
