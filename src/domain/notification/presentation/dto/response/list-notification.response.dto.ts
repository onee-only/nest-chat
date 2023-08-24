import { Notification } from 'src/domain/notification/entity';
import { NotificationDto } from '../internal';
import { ApiProperty } from '@nestjs/swagger';

export class ListNotificationResponse {
    @ApiProperty({ type: [NotificationDto] })
    public readonly notifications: NotificationDto[];

    @ApiProperty()
    public readonly totalCount: number;

    public static from(
        notifications: Notification[],
    ): ListNotificationResponse {
        return {
            notifications: notifications.map(
                (notification): NotificationDto => ({
                    uuid: notification.uuid,
                    content: notification.content,
                    createdAt: notification.createdAt,
                    room: notification.room
                        ? {
                              id: notification.room.id,
                              name: notification.room.name,
                              profileURL: notification.room.profileURL,
                          }
                        : null,
                    thread: notification.thread
                        ? {
                              id: notification.thread.id,
                              title: notification.thread.title,
                          }
                        : null,
                    message: notification.message
                        ? {
                              id: notification.message.id,
                              content: notification.message.content,
                              createdAt: notification.message.createdAt,
                              updatedAt: notification.message.updatedAt,
                              author: notification.issuer
                                  ? {
                                        nickname:
                                            notification.issuer.avatar.nickname,
                                        profileURL:
                                            notification.issuer.avatar
                                                .profileURL,
                                    }
                                  : null,
                              embedmentsCount:
                                  notification.message.embedments.length,
                          }
                        : null,
                }),
            ),
            totalCount: notifications.length,
        };
    }
}
