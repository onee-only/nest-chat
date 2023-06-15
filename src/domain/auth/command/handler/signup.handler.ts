import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SignupCommand } from '../signup.command';
import { SignupResponseDto } from '../../presentation/dto/response';
import { DuplicateEmailException } from '../../exception';
import { UserCreatedEvent } from '../../event';
import { AvatarRepository, UserRepository } from 'src/domain/user/repository';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly avatarRepository: AvatarRepository,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: SignupCommand): Promise<SignupResponseDto> {
        const { email, password, nickname } = command;

        if (await this.userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException(email);
        }

        const user = await this.userRepository.create({ email, password });
        user.avatar = await this.avatarRepository.create({ user, nickname });

        await this.userRepository.save(user);

        this.eventBus.publish(new UserCreatedEvent(user));

        return SignupResponseDto.from(user);
    }
}
