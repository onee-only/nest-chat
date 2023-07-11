import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMessageCommand } from '../create-message.command';
import { MessageRepository } from '../../repository';
import { PermissionChecker } from 'src/domain/room/util';
import {
    MemberRoleRepository,
    RoomMemberRepository,
    RoomRepository,
} from 'src/domain/room/repository';
import { ThreadRepository } from 'src/domain/thread/repository';
import { RoomNotFoundException } from 'src/domain/room/exception';
import { NoMathcingThreadException } from 'src/domain/thread/exception';
import { RoomPermission } from 'src/domain/room/enum';
import { MessageParser } from '../../util';
import { NoMatchingMessageException } from '../../exception';

@CommandHandler(CreateMessageCommand)
export class CreateMessageHandler
    implements ICommandHandler<CreateMessageCommand>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly memberRoleRepository: MemberRoleRepository,

        private readonly threadRepository: ThreadRepository,
        private readonly messageRepository: MessageRepository,

        private readonly permissionChecker: PermissionChecker,
        private readonly messageParser: MessageParser,
    ) {}

    async execute(command: CreateMessageCommand): Promise<void> {
        const { roomID, threadID, user, body, replyTo } = command;

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
            action: RoomPermission.WRITE_MESSAGE,
            room,
            user,
        });

        // should add embedments, reply
        const message = this.messageRepository.create({
            author: user,
            thread: thread,
            content: body,
        });

        const mentionNames = this.messageParser.parse(body);
        if (mentionNames.length !== 0) {
            message.mentionMembers =
                await this.roomMemberRepository.findByRoomAndUserNicknames(
                    room,
                    mentionNames,
                );

            message.mentionRoles =
                await this.memberRoleRepository.findByRoomAndAliases(
                    room,
                    mentionNames,
                );
        }

        if (replyTo !== undefined) {
            message.replyTo = await this.messageRepository
                .findOneByOrFail({ thread, id: replyTo })
                .catch(() => {
                    throw new NoMatchingMessageException(threadID, replyTo);
                });
        }

        await this.messageRepository.save(message);

        // should publish event
    }
}
