export type ListThreadElement = {
    readonly id: number;
    readonly title: string;
    readonly createdAt: Date;
    readonly tags: string[];

    readonly messageCount: number;
    readonly participantCount: number;

    readonly creator: {
        id: number;
        nickname: string;
        profileURL: string;
    };
};
