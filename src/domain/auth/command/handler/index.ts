import { SignupHandler } from './signup.handler';
import { SendEmailHandler } from './send-email.handler';
import { LogoutHandler } from './logout.handler';
import { VerifyEmailHandler } from './verify-email.handler';
import { UpdatePasswordHandler } from './update-password.handler';

export const CommandHandlers = [
    SignupHandler,
    SendEmailHandler,
    LogoutHandler,
    VerifyEmailHandler,
    UpdatePasswordHandler,
];
