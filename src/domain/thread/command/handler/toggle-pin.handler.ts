import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TogglePinCommand } from '../toggle-pin.command';
import { RoomRepository } from 'src/domain/room/repository';
import { PinnedThreadRepository, ThreadRepository } from '../../repository';
import {
    NoOwnerPermissionException,
    RoomNotFoundException,
} from 'src/domain/room/exception';
import { NoMathcingThreadException } from '../../exception';

@CommandHandler(TogglePinCommand)
export class TogglePinHandler implements ICommandHandler<TogglePinCommand> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly pinnedThreadRepository: PinnedThreadRepository,
    ) {}

    async execute(command: TogglePinCommand): Promise<void> {
        const { roomID, threadID, user } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        const thread = await this.threadRepository
            .findOneOrFail({
                where: { roomID: room.id, id: threadID },
            })
            .catch(() => {
                throw new NoMathcingThreadException(roomID, threadID);
            });

        if (room.ownerID != user.id) {
            throw new NoOwnerPermissionException();
        }

        const pinnedThread = this.pinnedThreadRepository.create({
            threadID: thread.id,
        });
        const exists = await this.pinnedThreadRepository.exist({
            where: pinnedThread,
        });

        if (exists) {
            await this.pinnedThreadRepository.delete(pinnedThread);
        } else {
            await this.pinnedThreadRepository.save(pinnedThread);
        }
    }
}
