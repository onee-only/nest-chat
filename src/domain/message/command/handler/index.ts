import { CreateMessageHandler } from './create-message.handler';
import { PublishMessageHandler } from './publish-message.handler';
import { PublishUpdateHandler } from './publish-update.handler';
import { UpdateMessageHandler } from './update-message.handler';

export const CommandHandlers = [
    CreateMessageHandler,
    PublishMessageHandler,
    UpdateMessageHandler,
    PublishUpdateHandler,
];
