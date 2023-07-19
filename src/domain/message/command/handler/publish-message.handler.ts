import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishMessageCommand } from '../publish-message.command';
import { ChatBroker } from 'src/domain/thread/util/chat';
import { StorageManager } from 'src/global/modules/utils';
import { MessageInfo } from 'src/domain/thread/util/chat/types';

@CommandHandler(PublishMessageCommand)
export class PublishMessageHandler
    implements ICommandHandler<PublishMessageCommand>
{
    constructor(
        private readonly chatBroker: ChatBroker,
        private readonly storageManager: StorageManager,
    ) {}

    async execute(command: PublishMessageCommand): Promise<void> {
        const { room, message } = command;
        const { author, thread, replyTo, embedments } = message;

        const msg: MessageInfo = {
            message: { ...message },
            author: { ...author, ...author.avatar },
            embedments: embedments.map((embedment) => ({
                name: embedment.name,
                url: this.storageManager.getFileURL(embedment.key),
            })),
        };

        if (replyTo !== undefined) {
            msg.replyTo = {
                author: { ...replyTo.author, ...replyTo.author.avatar },
                message: { ...replyTo },
            };
        }

        await this.chatBroker.publish(room.id, thread.id, msg);
    }
}
