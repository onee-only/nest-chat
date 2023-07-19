export type MessagePayload = MessageInfo | UpdateInfo | DeleteInfo;

export type DeleteInfo = {
    readonly id: number;
};

export type UpdateInfo = {
    readonly id: number;
    readonly content: string;
    readonly updatedAt: Date;
};

export type MessageInfo = {
    readonly author: AuthorInfo;
    readonly message: MsgInfo;
    replyTo?: ReplyInfo;

    readonly embedments: EmbedmentInfo[];
};

export type ReplyInfo = {
    readonly author: AuthorInfo;
    readonly message: MsgInfo;
};

export type AuthorInfo = {
    readonly id: number;
    readonly nickname: stirng;
    readonly profileURL: string;
};

export type MsgInfo = {
    readonly id: number;
    readonly content: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
};

export type EmbedmentInfo = {
    readonly name: string;
    readonly url: string;
};
