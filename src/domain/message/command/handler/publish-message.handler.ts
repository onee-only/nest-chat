import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishMessageCommand } from '../publish-message.command';
import { ChatBroker } from 'src/domain/thread/util/chat';
import { MessageInfo } from 'src/domain/thread/util/chat/types';

@CommandHandler(PublishMessageCommand)
export class PublishMessageHandler
    implements ICommandHandler<PublishMessageCommand>
{
    constructor(private readonly chatBroker: ChatBroker) {}

    async execute(command: PublishMessageCommand): Promise<void> {
        const { room, message } = command;
        const { author, thread, replyTo, embedments } = message;

        const msg: MessageInfo = {
            data: {
                message: {
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                },
                author: {
                    id: author.id,
                    nickname: author.avatar.nickname,
                    profileURL: author.avatar.profileURL,
                },
                embedments: embedments.map((embedment) => ({
                    name: embedment.name,
                    url: embedment.url,
                })),
            },
        };

        msg.data.replyTo = replyTo
            ? {
                  author: {
                      id: replyTo.author.id,
                      nickname: replyTo.author.avatar.nickname,
                      profileURL: replyTo.author.avatar.profileURL,
                  },
                  message: {
                      content: replyTo.content,
                      createdAt: replyTo.createdAt,
                      id: replyTo.id,
                      updatedAt: replyTo.updatedAt,
                  },
              }
            : null;

        await this.chatBroker.publish(room.id, thread.id, msg);
    }
}
