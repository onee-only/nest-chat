import { Message } from 'src/domain/message/entity';
import {
    AuthorInfo,
    EmbedmentInfo,
    MsgInfo,
    ReplyInfo,
} from 'src/domain/thread/util/chat/types';

type ListMessageElement = {
    readonly author: AuthorInfo;
    readonly message: MsgInfo;
    replyTo?: ReplyInfo;

    readonly embedments: EmbedmentInfo[];
};

export class ListMessageResponseDto {
    constructor(
        public readonly messages: ListMessageElement[],
        public readonly messageCount: number,
    ) {}

    public static from(messages: Message[]): ListMessageResponseDto {
        return new ListMessageResponseDto(
            messages.map(
                (message): ListMessageElement => ({
                    message: { ...message },
                    author: { ...message.author, ...message.author.avatar },
                    embedments: message.embedments.map((embedment) => ({
                        name: embedment.name,
                        url: embedment.url,
                    })),
                }),
            ),
            messages.length,
        );
    }
}
