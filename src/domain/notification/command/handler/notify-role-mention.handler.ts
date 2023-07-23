import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyRoleMentionCommand } from '../notify-role-mention.command';
import { RoomMemberRepository } from 'src/domain/room/repository';
import { NotificationRepository } from '../../repository';
import { NotificationType } from '../../enum';
import { Room } from 'src/domain/room/entity';
import { User } from 'src/domain/user/entity';
import { Notification } from '../../entity';
import { Message } from 'src/domain/message/entity';

@CommandHandler(NotifyRoleMentionCommand)
export class NotifyRoleMentionHandler
    implements ICommandHandler<NotifyRoleMentionCommand>
{
    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly notificationRepository: NotificationRepository,
    ) {}

    async execute(command: NotifyRoleMentionCommand): Promise<void> {
        const { message, roles, room } = command;

        const notifications = await Promise.all(
            roles.map((role) =>
                this.roomMemberRepository
                    .find({ where: { role, room }, relations: { user: true } })
                    .then((members) =>
                        members.map((member) =>
                            this.createNotification(room, message, member.user),
                        ),
                    ),
            ),
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
            type: NotificationType.ROLE_MENTION,
            content: ``,
            message: message,
            thread: message.thread,
            room: room,
            recipient: user,
            issuer: message.author,
        });
    }
}
