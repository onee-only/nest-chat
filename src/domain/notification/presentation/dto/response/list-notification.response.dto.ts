import { Notification } from 'src/domain/notification/entity';
import { NotificationDto } from '../internal';

export class ListNotificationResponse {
    constructor(
        public readonly notifications: NotificationDto[],
        public readonly totalCount: number,
    ) {}

    public static from(
        notifications: Notification[],
    ): ListNotificationResponse {
        return new ListNotificationResponse(
            notifications.map(
                (notification): NotificationDto => ({
                    ...notification,
                    message: {
                        ...notification.message,
                        author: { ...notification.message.author.avatar },
                        embedmentsCount: notification.message.embedments.length,
                    },
                }),
            ),
            notifications.length,
        );
    }
}
