import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyMemberMentionCommand } from '../notify-member-mention.command';
import { NotificationRepository } from '../../repository';
import { Room } from 'src/domain/room/entity';
import { Message } from 'src/domain/message/entity';
import { User } from 'src/domain/user/entity';
import { NotificationType } from '../../enum';
import { Notification } from '../../entity';

@CommandHandler(NotifyMemberMentionCommand)
export class NotifyMemberMentionHandler
    implements ICommandHandler<NotifyMemberMentionCommand>
{
    constructor(
        private readonly notificationRepository: NotificationRepository,
    ) {}

    async execute(command: NotifyMemberMentionCommand): Promise<void> {
        const { members, message, room } = command;

        const notifications = members.map((member) =>
            this.createNotification(room, message, member.user),
        );

        await this.notificationRepository.insert(notifications.flat());
        // should publish event
    }

    private createNotification(
        room: Room,
        message: Message,
        user: User,
    ): Notification {
        return this.notificationRepository.create({
            type: NotificationType.MEMBER_MENTION,
            content: ``,
            message: message,
            thread: message.thread,
            room: room,
            recipient: user,
            issuer: message.author,
        });
    }
}
