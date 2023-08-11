import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateThreadCommand } from '../create-thread.command';
import { RoomRepository } from 'src/domain/room/repository';
import { PermissionChecker } from 'src/domain/room/util';
import { ThreadRepository } from '../../repository';
import { RoomNotFoundException } from 'src/domain/room/exception';
import { RoomPermission } from 'src/domain/room/enum';
import { CreateThreadResponse } from '../../presentation/dto/response';

@CommandHandler(CreateThreadCommand)
export class CreateThreadHandler
    implements ICommandHandler<CreateThreadCommand>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(command: CreateThreadCommand): Promise<CreateThreadResponse> {
        const { roomID, title, user } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        await this.permissionChecker.checkOrThrow({
            action: RoomPermission.CREATE_THREAD,
            room,
            user,
        });

        const candiate = this.threadRepository.create({
            creator: user,
            room: room,
            title: title,
        });

        const thread = await this.threadRepository.save(candiate);

        return CreateThreadResponse.from(thread);
    }
}
