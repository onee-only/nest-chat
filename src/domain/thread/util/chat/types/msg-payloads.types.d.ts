import { MessageEvent } from '@nestjs/common';
import { MessageKind } from './msg-kind.enum';

export class DeleteInfo implements MessageEvent {
    readonly data: {
        readonly id: number;
    };
    readonly type: string = MessageKind.DELETE;
}

export class UpdateInfo implements MessageEvent {
    readonly data: {
        readonly id: number;
        readonly content: string;
        readonly updatedAt: Date;
    };
    readonly type: string = MessageKind.UPDATE;
}

export class MessageInfo implements MessageEvent {
    readonly data: {
        readonly author: AuthorInfo;
        readonly message: MsgInfo;
        replyTo?: ReplyInfo;

        readonly embedments: EmbedmentInfo[];
    };
    readonly type?: string = MessageKind.CREATE;
}

export class ReplyInfo implements MessageEvent {
    readonly author: AuthorInfo;
    readonly message: MsgInfo;
}

export type AuthorInfo = {
    readonly id: number;
    readonly nickname: stirng;
    readonly profileURL: string;
};

export type MsgInfo = {
    readonly id: string;
    readonly content: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
};

export type EmbedmentInfo = {
    readonly name: string;
    readonly url: string;
};
