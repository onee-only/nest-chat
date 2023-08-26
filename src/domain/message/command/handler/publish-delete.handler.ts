import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishDeleteCommand } from '../publish-delete.command';
import { ChatBroker } from 'src/domain/thread/util/chat';
import { DeleteInfo } from 'src/domain/thread/util/chat/types';

@CommandHandler(PublishDeleteCommand)
export class PublishDeleteHandler
    implements ICommandHandler<PublishDeleteCommand>
{
    constructor(private readonly chatBroker: ChatBroker) {}

    async execute(command: PublishDeleteCommand): Promise<void> {
        const { message, room, thread } = command;

        const msg: DeleteInfo = {
            data: {
                id: message.id,
            },
        };

        await this.chatBroker.publish(room.id, thread.id, msg);
    }
}
