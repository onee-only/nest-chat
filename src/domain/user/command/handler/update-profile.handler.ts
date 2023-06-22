import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileCommand } from '../update-profile.command';
import { UserRepository } from '../../repository';
import { GetMyProfileResponseDto } from '../../presentation/dto/response';
import { ObjectManager } from 'src/global/modules/utils/object/object.manager';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
    implements ICommandHandler<UpdateProfileCommand>
{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly objectUtil: ObjectManager,
    ) {}

    async execute(
        command: UpdateProfileCommand,
    ): Promise<GetMyProfileResponseDto> {
        const { user, data } = command;

        const filtered = this.objectUtil.filterNullish(data);
        Object.assign(user.avatar, filtered);

        await this.userRepository.save(user);

        return GetMyProfileResponseDto.from(user);
    }
}
