import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMessageCommand } from '../create-message.command';
import { EmbedmentRepository, MessageRepository } from '../../repository';
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
import { MemberRole, Room, RoomMember } from 'src/domain/room/entity';
import { Embedment, Message } from '../../entity';
import { Thread } from 'src/domain/thread/entity';
import { StorageManager, UploadResult } from 'src/global/modules/utils';

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
        private readonly embedementsRepository: EmbedmentRepository,

        private readonly permissionChecker: PermissionChecker,
        private readonly messageParser: MessageParser,
        private readonly storageManager: StorageManager,
    ) {}

    async execute(command: CreateMessageCommand): Promise<void> {
        const {
            roomID,
            threadID,
            user,
            data: { body, replyTo, embedments },
        } = command;

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

        const names = this.messageParser.parse(body);
        message.mentionMembers = await this.findMentionMembers(names, room);
        message.mentionRoles = await this.findMentionRoles(names, room);

        const results = await this.storageManager.uploadFiles(
            'messages/embedments',
            embedments,
        );
        message.embedments = this.createEmbedments(message, results);

        message.replyTo = message.replyTo = await this.findReplyTo(
            replyTo,
            thread,
        );

        await this.messageRepository.save(message);

        // should publish event
    }

    private async findMentionMembers(
        mentionNames: string[],
        room: Room,
    ): Promise<RoomMember[]> {
        if (mentionNames.length !== 0) {
            return await this.roomMemberRepository.findByRoomAndUserNicknames(
                room,
                mentionNames,
            );
        }
        return null;
    }

    private async findMentionRoles(
        mentionNames: string[],
        room: Room,
    ): Promise<MemberRole[]> {
        if (mentionNames.length !== 0) {
            return await this.memberRoleRepository.findByRoomAndAliases(
                room,
                mentionNames,
            );
        }
        return null;
    }

    private async findReplyTo(
        replyTo: number,
        thread: Thread,
    ): Promise<Message> {
        if (replyTo !== undefined) {
            return await this.messageRepository
                .findOneByOrFail({ thread, id: replyTo })
                .catch(() => {
                    throw new NoMatchingMessageException(thread.id, replyTo);
                });
        }
        return null;
    }

    private createEmbedments(
        message: Message,
        results: UploadResult[],
    ): Embedment[] {
        return results.map(({ key, originalName }) =>
            this.embedementsRepository.create({
                key,
                message,
                name: originalName,
            }),
        );
    }
}
