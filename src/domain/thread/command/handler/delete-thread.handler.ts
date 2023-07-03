import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteThreadCommand } from '../delete-thread.command';
import { RoomRepository } from 'src/domain/room/repository';
import { ThreadRepository } from '../../repository';
import { RoomNotFoundException } from 'src/domain/room/exception';
import {
    NoCreatorPermissionException,
    NoMathcingThreadException,
} from '../../exception';

@CommandHandler(DeleteThreadHandler)
export class DeleteThreadHandler
    implements ICommandHandler<DeleteThreadCommand>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
    ) {}

    async execute(command: DeleteThreadCommand): Promise<void> {
        const { roomID, threadID, user } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        const thread = await this.threadRepository
            .findOneOrFail({
                relations: { creator: true },
                where: { room: room, id: threadID },
            })
            .catch(() => {
                throw new NoMathcingThreadException(roomID, threadID);
            });

        if (thread.creator != user) {
            throw new NoCreatorPermissionException(threadID);
        }

        await this.threadRepository.delete(thread);
    }
}
