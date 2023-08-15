import { SignupHandler } from './signup.handler';
import { SendEmailHandler } from './send-email.handler';
import { LogoutHandler } from './logout.handler';
import { VerifyEmailHandler } from './verify-email.handler';

export const CommandHandlers = [
    SignupHandler,
    SendEmailHandler,
    LogoutHandler,
    VerifyEmailHandler,
];
