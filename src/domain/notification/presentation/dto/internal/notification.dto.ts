export type NotificationDto = {
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
