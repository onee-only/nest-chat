import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileCommand } from '../update-profile.command';
import { UserRepository } from '../../repository';
import { GetMyProfileResponse } from '../../presentation/dto/response';
import { ObjectManager } from 'src/global/modules/utils';

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
    ): Promise<GetMyProfileResponse> {
        const { user, data } = command;

        Object.assign(user.avatar, this.objectUtil.filterNullish(data));

        await this.userRepository.save(user);

        return GetMyProfileResponse.from(user);
    }
}
