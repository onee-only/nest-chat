import { MessageEvent } from '@nestjs/common';
import { MessageKind } from './msg-kind.enum';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteInfo implements MessageEvent {
    readonly data: {
        readonly id: string;
    };
    readonly type? = MessageKind.DELETE;
}

export class UpdateInfo implements MessageEvent {
    readonly data: {
        readonly id: string;
        readonly content: string;
        readonly updatedAt: Date;
    };
    readonly type? = MessageKind.UPDATE;
}

export class MsgInfo {
    @ApiProperty()
    public readonly id: string;

    @ApiProperty()
    public readonly content: string;

    @ApiProperty()
    public readonly createdAt: Date;

    @ApiProperty()
    public readonly updatedAt: Date;
}

export class EmbedmentInfo {
    @ApiProperty()
    public readonly name: string;

    @ApiProperty()
    public readonly url: string;
}

export class MessageInfo implements MessageEvent {
    readonly data: {
        readonly author: AuthorInfo;
        readonly message: MsgInfo;
        replyTo?: ReplyInfo;

        readonly embedments: EmbedmentInfo[];
    };
    readonly type? = MessageKind.CREATE;
}

export class AuthorInfo {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly nickname: string;

    @ApiProperty()
    public readonly profileURL: string;
}

export class ReplyInfo {
    @ApiProperty()
    public readonly author: AuthorInfo;

    @ApiProperty()
    public readonly message: MsgInfo;
}
