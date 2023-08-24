import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyMemberMentionCommand } from '../notify-member-mention.command';
import { NotificationRepository } from '../../repository';
import { Room } from 'src/domain/room/entity';
import { Message } from 'src/domain/message/entity';
import { User } from 'src/domain/user/entity';
import { NotificationType } from '../../enum';
import { Notification } from '../../entity';
import { NotifiactionPublisher } from '../../util';
import { v4 as generateUUID } from 'uuid';

@CommandHandler(NotifyMemberMentionCommand)
export class NotifyMemberMentionHandler
    implements ICommandHandler<NotifyMemberMentionCommand>
{
    constructor(
        private readonly notificationPublisher: NotifiactionPublisher,

        private readonly notificationRepository: NotificationRepository,
    ) {}

    async execute(command: NotifyMemberMentionCommand): Promise<void> {
        const { members, message, room } = command;

        const results = members.map((member) =>
            this.createNotification(room, message, member.user),
        );
        const candidates = results.flat();

        const notifications = await this.notificationRepository.save(
            candidates,
        );
        this.notificationPublisher.publish(...notifications);
    }

    private createNotification(
        room: Room,
        message: Message,
        user: User,
    ): Notification {
        return this.notificationRepository.create({
            uuid: generateUUID(),
            type: NotificationType.MEMBER_MENTION,
            content: `You are mentioned by ${message.author.avatar.nickname}`,
            message: message,
            thread: message.thread,
            room: room,
            recipient: user,
            issuer: message.author,
        });
    }
}
