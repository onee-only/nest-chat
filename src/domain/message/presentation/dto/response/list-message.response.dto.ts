import { ApiProperty } from '@nestjs/swagger';
import { Message } from 'src/domain/message/entity';
import {
    AuthorInfo,
    EmbedmentInfo,
    MsgInfo,
    ReplyInfo,
} from 'src/domain/thread/util/chat/types';

class ListMessageElement {
    @ApiProperty()
    public readonly author: AuthorInfo;

    @ApiProperty()
    public readonly message: MsgInfo;

    @ApiProperty()
    public replyTo?: ReplyInfo;

    @ApiProperty({ type: [EmbedmentInfo] })
    public readonly embedments: EmbedmentInfo[];
}

export class ListMessageResponse {
    @ApiProperty({ type: [ListMessageElement] })
    public readonly messages: ListMessageElement[];

    @ApiProperty()
    public readonly messageCount: number;

    public static from(messages: Message[]): ListMessageResponse {
        return {
            messages: messages.map(
                (message): ListMessageElement => ({
                    message: {
                        id: message.id,
                        content: message.content,
                        createdAt: message.createdAt,
                        updatedAt: message.updatedAt,
                    },
                    author: {
                        id: message.authorID,
                        nickname: message.author.avatar.nickname,
                        profileURL: message.author.avatar.profileURL,
                    },
                    embedments: message.embedments.map((embedment) => ({
                        name: embedment.name,
                        url: embedment.url,
                    })),
                    replyTo: message.replyTo
                        ? {
                              author: {
                                  id: message.replyTo.authorID,
                                  nickname:
                                      message.replyTo.author.avatar.nickname,
                                  profileURL:
                                      message.replyTo.author.avatar.profileURL,
                              },
                              message: {
                                  id: message.replyTo.id,
                                  content: message.replyTo.content,
                                  createdAt: message.replyTo.createdAt,
                                  updatedAt: message.replyTo.updatedAt,
                              },
                          }
                        : null,
                }),
            ),
            messageCount: messages.length,
        };
    }
}
