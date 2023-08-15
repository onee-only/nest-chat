import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from '../verify-email.command';
import { EmailConfirmationRepository } from '../../repository/email-confirmation.repository';
import { UserRepository } from 'src/domain/user/repository';
import { InvalidEmailTokenException } from '../../exception';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
    constructor(
        private readonly emailConfirmationRepository: EmailConfirmationRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: VerifyEmailCommand): Promise<void> {
        const { token } = command;

        const { user } = await this.emailConfirmationRepository
            .findOneOrFail({
                relations: {
                    user: true,
                },
                where: { token },
            })
            .catch(() => {
                throw new InvalidEmailTokenException();
            });

        await this.userRepository.verifyEmail(user);
    }
}
