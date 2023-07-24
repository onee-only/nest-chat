import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyReplyCommand } from '../notify-reply.command';
import { NotificationRepository } from '../../repository';
import { NotificationType } from '../../enum';
import { Room } from 'src/domain/room/entity';
import { Message } from 'src/domain/message/entity';
import { User } from 'src/domain/user/entity';
import { Notification } from '../../entity';

@CommandHandler(NotifyReplyCommand)
export class NotifyReplyHandler implements ICommandHandler<NotifyReplyCommand> {
    constructor(
        private readonly notificationRepository: NotificationRepository,
    ) {}

    async execute(command: NotifyReplyCommand): Promise<void> {
        const { reply, room, target } = command;

        const notification = this.createNotification(
            room,
            reply,
            target.author,
        );

        await this.notificationRepository.insert(notification);
        // should publish event
    }

    private createNotification(
        room: Room,
        message: Message,
        user: User,
    ): Notification {
        return this.notificationRepository.create({
            type: NotificationType.REPLY,
            content: ``,
            message: message,
            thread: message.thread,
            room: room,
            recipient: user,
            issuer: message.author,
        });
    }
}
