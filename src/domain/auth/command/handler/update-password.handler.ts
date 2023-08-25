import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePasswordCommand } from '../update-password.command';
import { UserRepository } from 'src/domain/user/repository';
import { PasswordManager } from '../../util';
import { InvalidPasswordException } from '../../exception';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler
    implements ICommandHandler<UpdatePasswordCommand>
{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordMananger: PasswordManager,
    ) {}

    async execute(command: UpdatePasswordCommand): Promise<void> {
        const { user, currentPassword, newPassword } = command;

        const currentHashed = await this.passwordMananger.hash(currentPassword);
        const matches = await this.passwordMananger.compare(
            user.password,
            currentHashed,
        );
        if (!matches) {
            throw new InvalidPasswordException();
        }

        const newHashed = await this.passwordMananger.hash(newPassword);
        user.password = newHashed;

        await this.userRepository.save(user);
    }
}
