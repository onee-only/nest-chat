import { CreateMessageHandler } from './create-message.handler';
import { PublishMessageHandler } from './publish-message.handler';

export const CommandHandlers = [CreateMessageHandler, PublishMessageHandler];
