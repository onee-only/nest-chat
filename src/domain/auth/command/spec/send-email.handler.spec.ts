import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailHandler } from '../handler/send-email.handler';
import { EmailConfirmationRepository } from '../../repository/email-confirmation.repository';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import {
    EmailConfig,
    IEmailConfig,
    IServerConfig,
    ServerConfig,
} from 'src/global/config';
import { Avatar, User } from 'src/domain/user/entity';
import { SendEmailCommand } from '../send-email.command';

describe('SendEmailHandler', () => {
    let sendEmailHandler: SendEmailHandler;
    let emailConfirmationRepository: EmailConfirmationRepository;
    let configService: ConfigService;
    let mailService: MailerService;

    const serverConfig: IServerConfig = {
        frontend: {
            domain: 'test.com',
            emailVerifyPath: '/verify',
        },
    };
    const emailConfig: IEmailConfig = {
        duration: 86400, // seconds in a day
        moduleOptions: {},
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SendEmailHandler,
                {
                    provide: EmailConfirmationRepository,
                    useValue: {
                        save: jest.fn(),
                        create: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key == ServerConfig.KEY) {
                                return serverConfig;
                            }
                            if (key == EmailConfig.KEY) {
                                return emailConfig;
                            }
                        }),
                    },
                },
                {
                    provide: MailerService,
                    useValue: {
                        sendMail: jest.fn(),
                    },
                },
            ],
        }).compile();

        sendEmailHandler = module.get(SendEmailHandler);
        emailConfirmationRepository = module.get(EmailConfirmationRepository);
        configService = module.get(ConfigService);
        mailService = module.get(MailerService);
    });

    it('should send an email', () => {
        // given
        const avatar = new Avatar();
        avatar.nickname = 'hi';

        const user = new User();
        user.avatar = avatar;
        user.email = 'hi';

        // when & then
        expect(
            sendEmailHandler.execute(new SendEmailCommand(user)),
        ).resolves.not.toThrow();
    });
});
