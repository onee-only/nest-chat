export type RoomListElement = {
    id: number;
    name: string;
    profileURL: string;
    description: string;
    memberCount: number;
    createdAt: Date;
    isMember: boolean;

    owner: {
        id: number;
        nickname: string;
        profileURL: string;
    };
};
