import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMessageQuery } from '../list-message.query';
import { ListMessageResponse } from '../../presentation/dto/response';
import { RoomRepository } from 'src/domain/room/repository';
import { ThreadRepository } from 'src/domain/thread/repository';
import { MessageRepository } from '../../repository';
import { RoomNotFoundException } from 'src/domain/room/exception';
import { NoMathcingThreadException } from 'src/domain/thread/exception';
import { LessThan } from 'typeorm';
import { PermissionChecker } from 'src/domain/room/util';

@QueryHandler(ListMessageQuery)
export class ListMessageHandler implements IQueryHandler<ListMessageQuery> {
    constructor(
        private readonly permissionChecker: PermissionChecker,

        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly messageRepository: MessageRepository,
    ) {}

    async execute(query: ListMessageQuery): Promise<ListMessageResponse> {
        const {
            user,
            options: { endDate, limit, roomID, threadID },
        } = query;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        const thread = await this.threadRepository
            .findOneByOrFail({ id: threadID, roomID })
            .catch(() => {
                throw new NoMathcingThreadException(roomID, threadID);
            });

        await this.permissionChecker.checkOrThrow({
            room: room,
            user: user,
        });

        const messages = await this.messageRepository.find({
            where: { threadID: thread.id, createdAt: LessThan(endDate) },
            relations: {
                author: { avatar: true },
                embedments: true,
                replyTo: true,
            },
            take: limit,
        });

        return ListMessageResponse.from(messages);
    }
}
