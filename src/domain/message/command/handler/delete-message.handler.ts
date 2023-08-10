import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMessageCommand } from '../delete-message.command';
import { RoomRepository } from 'src/domain/room/repository';
import { ThreadRepository } from 'src/domain/thread/repository';
import { MessageRepository } from '../../repository';
import { PermissionChecker } from 'src/domain/room/util';
import { ChatBroker } from 'src/domain/thread/util/chat';
import { RoomNotFoundException } from 'src/domain/room/exception';
import {
    NoMathcingThreadException,
    NotParticipatingException,
} from 'src/domain/thread/exception';
import { RoomPermission } from 'src/domain/room/enum';
import {
    NoMatchingMessageException,
    NotAuthorException,
} from '../../exception';
import { StorageManager } from 'src/global/modules/utils';
import { MessageDeletedEvent } from '../../event';

@CommandHandler(DeleteMessageCommand)
export class DeleteMessageHandler
    implements ICommandHandler<DeleteMessageCommand>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly messageRepository: MessageRepository,

        private readonly permissionChecker: PermissionChecker,
        private readonly chatBroker: ChatBroker,
        private readonly storageManager: StorageManager,

        private readonly eventBus: EventBus,
    ) {}

    async execute(command: DeleteMessageCommand): Promise<void> {
        const { messageID, roomID, threadID, user } = command;

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
            action: RoomPermission.DELETE_MESSAGE,
            room,
            user,
        });

        const message = await this.messageRepository
            .findOneOrFail({
                where: { thread: thread, id: messageID },
                relations: { embedments: true },
            })
            .catch(() => {
                throw new NoMatchingMessageException(threadID, messageID);
            });

        if (message.author != user) {
            throw new NotAuthorException();
        }

        await this.messageRepository.delete(message);

        this.storageManager.deleteFiles(
            message.embedments.map((embedment) => embedment.key),
        );
        this.eventBus.publishAll([
            new MessageDeletedEvent(room, thread, message),
        ]);
    }
}
