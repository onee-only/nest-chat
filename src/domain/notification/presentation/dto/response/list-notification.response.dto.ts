import { Notification } from 'src/domain/notification/entity';

export type ListNotificaitonElement = {
    readonly uuid: string;
    readonly content: string;
    readonly createdAt: Date;

    readonly room: {
        readonly id: number;
        readonly name: string;
        readonly profileURL: string;
    };

    readonly thread: {
        readonly id: number;
        readonly title: string;
    };

    readonly message: {
        readonly id: string;
        readonly content: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;

        readonly embedmentsCount: number;

        readonly author: {
            readonly nickname: string;
            readonly profileURL: string;
        };
    };
};

export class ListNotificationResponseDto {
    constructor(
        public readonly notifications: ListNotificaitonElement[],
        public readonly totalCount: number,
    ) {}

    public static from(
        notifications: Notification[],
    ): ListNotificationResponseDto {
        return new ListNotificationResponseDto(
            notifications.map(
                (notification): ListNotificaitonElement => ({
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
