import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMessageCommand } from '../update-message.command';
import { RoomNotFoundException } from 'src/domain/room/exception';
import {
    NoMathcingThreadException,
    NotParticipatingException,
} from 'src/domain/thread/exception';
import { RoomRepository } from 'src/domain/room/repository';
import { ThreadRepository } from 'src/domain/thread/repository';
import { PermissionChecker } from 'src/domain/room/util';
import { MessageRepository } from '../../repository';
import { RoomPermission } from 'src/domain/room/enum';
import { ChatBroker } from 'src/domain/thread/util/chat';
import { MessageUpdatedEvent } from '../../event';
import {
    NoMatchingMessageException,
    NotAuthorException,
} from '../../exception';

@CommandHandler(UpdateMessageCommand)
export class UpdateMessageHandler
    implements ICommandHandler<UpdateMessageCommand>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly messageRepository: MessageRepository,

        private readonly permissionChecker: PermissionChecker,
        private readonly chatBroker: ChatBroker,

        private readonly eventBus: EventBus,
    ) {}

    async execute(command: UpdateMessageCommand): Promise<void> {
        const { body, messageID, roomID, threadID, user } = command;

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

        const participating = await this.chatBroker.isParticipating(
            user,
            room.id,
            thread.id,
        );
        if (!participating) {
            throw new NotParticipatingException();
        }

        await this.permissionChecker.checkOrThrow({
            action: RoomPermission.WRITE_MESSAGE,
            room,
            user,
        });

        const message = await this.messageRepository
            .findOneByOrFail({
                threadID: thread.id,
                id: messageID,
            })
            .catch(() => {
                throw new NoMatchingMessageException(threadID, messageID);
            });

        if (message.authorID != user.id) {
            throw new NotAuthorException();
        }

        message.content = body;
        await this.messageRepository.save(message);

        this.eventBus.publishAll([
            new MessageUpdatedEvent(room, thread, message),
        ]);
    }
}
