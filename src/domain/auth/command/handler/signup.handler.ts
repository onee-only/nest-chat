import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SignupCommand } from '../signup.command';
import { SignupResponse } from '../../presentation/dto/response';
import { DuplicateEmailException } from '../../exception';
import { UserCreatedEvent } from '../../event';
import { AvatarRepository, UserRepository } from 'src/domain/user/repository';
import { DuplicateNicknameException } from 'src/domain/user/exception';
import { PasswordManager } from '../../util';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly avatarRepository: AvatarRepository,
        private readonly passwordManager: PasswordManager,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: SignupCommand): Promise<SignupResponse> {
        const { email, password, nickname } = command;

        if (await this.userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException(email);
        }

        if (await this.avatarRepository.existsByNickname(nickname)) {
            throw new DuplicateNicknameException(nickname);
        }

        const user = this.userRepository.create({ email });
        user.password = await this.passwordManager.hash(password);

        await this.userRepository.save(user);

        const avatar = this.avatarRepository.create({
            user: user,
            nickname: nickname,
            userID: user.id,
        });

        await this.avatarRepository.save(avatar);
        user.avatar = avatar;

        this.eventBus.publish(new UserCreatedEvent(user));

        return SignupResponse.from(user);
    }
}
