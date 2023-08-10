import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishUpdateCommand } from '../publish-update.command';
import { ChatBroker } from 'src/domain/thread/util/chat';
import { UpdateInfo } from 'src/domain/thread/util/chat/types';

@CommandHandler(PublishUpdateCommand)
export class PublishUpdateHandler
    implements ICommandHandler<PublishUpdateCommand>
{
    constructor(private readonly chatBroker: ChatBroker) {}

    async execute(command: PublishUpdateCommand): Promise<any> {
        const { message, thread, room } = command;

        const msg: UpdateInfo = {
            data: {
                content: message.content,
                id: message.id,
                updatedAt: message.updatedAt,
            },
        };

        await this.chatBroker.publish(room.id, thread.id, msg);
    }
}
