import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailComfirmationRepository } from '../../repository/email-confirmation.repository';
import { SendEmailCommand } from '../send-email.command';
import { ConfigService } from '@nestjs/config';
import {
    EmailConfig,
    IEmailConfig,
    IServerConfig,
    ServerConfig,
} from 'src/global/config';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
    constructor(
        private readonly emailConfirmationRepository: EmailComfirmationRepository,
        private readonly configService: ConfigService,
        private readonly mailService: MailerService,
    ) {}

    async execute(command: SendEmailCommand): Promise<void> {
        const { user } = command;

        const { duration } = this.getEmailConfig();
        const { domain, emailVerifyPath } = this.getFrontendConfig();

        const expiresAt = new Date(Date.now() + duration);
        const token = await bcrypt.hash(user.email, 3);

        await this.emailConfirmationRepository.save(
            this.emailConfirmationRepository.create({
                user: user,
                expiration: expiresAt,
                token: token,
            }),
        );

        await this.mailService.sendMail({
            to: user.email,
            subject: 'Verify your email',
            template: 'verification.pug',
            context: {
                nickname: user.avatar.nickname,
                expiration: expiresAt.toISOString(),
                token: token,
                domain: domain,
                path: emailVerifyPath,
            },
        });
    }

    private getFrontendConfig() {
        const { frontend } = this.configService.get<IServerConfig>(
            ServerConfig.KEY,
        );
        return frontend;
    }

    private getEmailConfig() {
        return this.configService.get<IEmailConfig>(EmailConfig.KEY);
    }
}
