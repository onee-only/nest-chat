import { Notification } from 'src/domain/notification/entity';
import { NotificationDto } from '../internal';

export class ListNotificationResponseDto {
    constructor(
        public readonly notifications: NotificationDto[],
        public readonly totalCount: number,
    ) {}

    public static from(
        notifications: Notification[],
    ): ListNotificationResponseDto {
        return new ListNotificationResponseDto(
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
