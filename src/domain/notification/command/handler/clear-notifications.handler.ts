import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClearNotificationsCommand } from '../clear-notifications.command';
import { NotificationRepository } from '../../repository';

@CommandHandler(ClearNotificationsCommand)
export class ClearNotificationHandler
    implements ICommandHandler<ClearNotificationsCommand>
{
    constructor(
        private readonly notificationRepository: NotificationRepository,
    ) {}

    async execute(command: ClearNotificationsCommand): Promise<void> {
        const { user } = command;

        await this.notificationRepository.delete({ recipient: user });
    }
}
