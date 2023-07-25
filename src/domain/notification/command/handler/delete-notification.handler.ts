import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteNotificationCommand } from '../delete-notification.command';
import { NotificationRepository } from '../../repository';
import { NotificationNotFoundException } from '../../exception';

@CommandHandler(DeleteNotificationCommand)
export class DeleteNotificationHandler
    implements ICommandHandler<DeleteNotificationCommand>
{
    constructor(
        private readonly notificationRepository: NotificationRepository,
    ) {}

    async execute(command: DeleteNotificationCommand): Promise<void> {
        const { uuid, user } = command;

        const notificaiton = await this.notificationRepository
            .findOneByOrFail({
                uuid: uuid,
                recipient: user,
            })
            .catch(() => {
                throw new NotificationNotFoundException(uuid);
            });

        await this.notificationRepository.remove(notificaiton);
    }
}
