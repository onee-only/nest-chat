import { MailerModule as NodeMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EMAIL_CONFIG, IEmailConfig } from '.';

@Module({
    imports: [
        // nodemailer
        NodeMailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
                config.get<IEmailConfig>(EMAIL_CONFIG).moduleOptions,
        }),
    ],
})
export class MailerModule {}
