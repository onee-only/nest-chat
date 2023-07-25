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
                message: { ...message },
                author: { ...author, ...author.avatar },
                embedments: embedments.map((embedment) => ({
                    name: embedment.name,
                    url: embedment.url,
                })),
            },
        };

        if (replyTo !== undefined) {
            msg.data.replyTo = {
                author: { ...replyTo.author, ...replyTo.author.avatar },
                message: { ...replyTo },
            };
        }

        await this.chatBroker.publish(room.id, thread.id, msg);
    }
}
