import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyReplyCommand } from '../notify-reply.command';
import { NotificationRepository } from '../../repository';
import { NotificationType } from '../../enum';
import { Room } from 'src/domain/room/entity';
import { Message } from 'src/domain/message/entity';
import { User } from 'src/domain/user/entity';
import { Notification } from '../../entity';
import { NotifiactionPublisher } from '../../util';
import { v4 as generateUUID } from 'uuid';

@CommandHandler(NotifyReplyCommand)
export class NotifyReplyHandler implements ICommandHandler<NotifyReplyCommand> {
    constructor(
        private readonly notificationPublisher: NotifiactionPublisher,

        private readonly notificationRepository: NotificationRepository,
    ) {}

    async execute(command: NotifyReplyCommand): Promise<void> {
        const { reply, room, target } = command;

        const candidate = this.createNotification(room, reply, target.author);

        const notification = await this.notificationRepository.save(candidate);
        this.notificationPublisher.publish(notification);
    }

    private createNotification(
        room: Room,
        message: Message,
        user: User,
    ): Notification {
        return this.notificationRepository.create({
            uuid: generateUUID(),
            type: NotificationType.REPLY,
            content: `Your message is replied by ${message.author.avatar.nickname}`,
            message: message,
            thread: message.thread,
            room: room,
            recipient: user,
            issuer: message.author,
        });
    }
}
