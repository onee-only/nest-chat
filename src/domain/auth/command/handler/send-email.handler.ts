import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationRepository } from '../../repository/email-confirmation.repository';
import { SendEmailCommand } from '../send-email.command';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { IServerConfig } from 'src/global/modules/config/server';
import { EMAIL_CONFIG, IEmailConfig } from 'src/global/modules/email';
import { OnModuleInit } from '@nestjs/common';
import { SERVER_CONFIG } from 'src/global/modules/config/server/server.config';
import { v4 as generateUUID } from 'uuid';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler
    implements ICommandHandler<SendEmailCommand>, OnModuleInit
{
    constructor(
        private readonly emailConfirmationRepository: EmailConfirmationRepository,
        private readonly configService: ConfigService,
        private readonly mailService: MailerService,
    ) {}

    private emailConfig: IEmailConfig;
    private serverConfig: IServerConfig;

    async onModuleInit() {
        this.serverConfig =
            this.configService.get<IServerConfig>(SERVER_CONFIG);
        this.emailConfig = this.configService.get<IEmailConfig>(EMAIL_CONFIG);
    }

    async execute(command: SendEmailCommand): Promise<void> {
        const { user } = command;

        const { duration } = this.emailConfig;
        const { domain, emailVerifyPath } = this.serverConfig.frontend;

        const expiresAt = new Date(Date.now() + duration);
        const token = generateUUID();

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
}
