import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailComfirmationRepository } from '../../repository/email-confirmation.repository';
import { SendEmailCommand } from '../send-email.command';
import { ConfigService } from '@nestjs/config';
import { EmailConfig, IEmailConfig } from 'src/global/config';
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

        const { duration } = this.configService.get<IEmailConfig>(
            EmailConfig.KEY,
        );

        const expiration = new Date(Date.now() + duration);
        const token = await bcrypt.hash(user.email, 3);

        const emailConfirmation = this.emailConfirmationRepository.create({
            user,
            expiration,
            token,
        });

        await this.emailConfirmationRepository.save(emailConfirmation);

        await this.mailService.sendMail({
            to: user.email,
            subject: 'Verify your email',
            template: 'verification.pug',
            context: {
                nickname: user.avatar.nickname,
                expiration: expiration.toISOString(),
                token: token,
            },
        });
    }
}
