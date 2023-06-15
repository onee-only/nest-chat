import { SignupHandler } from './signup.handler';
import { SendEmailHandler } from './send-email.handler';

export const CommandHandlers = [SignupHandler, SendEmailHandler];

export { SignupHandler, SendEmailHandler };
