import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListNotificationQuery } from '../list-notification.query';
import { ListNotificationResponse } from '../../presentation/dto/response';
import { NotificationRepository } from '../../repository';

@QueryHandler(ListNotificationQuery)
export class ListNotificationHandler
    implements IQueryHandler<ListNotificationQuery>
{
    constructor(
        private readonly notificationRepository: NotificationRepository,
    ) {}

    async execute(
        query: ListNotificationQuery,
    ): Promise<ListNotificationResponse> {
        const { user } = query;

        const notifications = await this.notificationRepository.find({
            where: { recipient: user },
            relations: {
                issuer: { avatar: true },
                room: true,
                thread: true,
                message: true,
            },
            order: { createdAt: 'DESC' },
            take: 20,
        });

        return ListNotificationResponse.from(notifications);
    }
}
