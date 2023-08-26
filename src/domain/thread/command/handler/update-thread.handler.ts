import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateThreadCommand } from '../update-thread.command';
import { ObjectManager } from 'src/global/modules/utils';
import { RoomRepository } from 'src/domain/room/repository';
import { ThreadRepository } from '../../repository';
import { RoomNotFoundException } from 'src/domain/room/exception';
import {
    NoCreatorPermissionException,
    NoMathcingThreadException,
} from '../../exception';
import { TagRepository } from 'src/domain/tag/repository/tag.repository';

@CommandHandler(UpdateThreadCommand)
export class UpdateThreadHandler
    implements ICommandHandler<UpdateThreadCommand>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly tagRepository: TagRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly objectManager: ObjectManager,
    ) {}

    async execute(command: UpdateThreadCommand): Promise<void> {
        const { user, roomID, threadID, data } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        const thread = await this.threadRepository
            .findOneByOrFail({ roomID: room.id, id: threadID })
            .catch(() => {
                throw new NoMathcingThreadException(roomID, threadID);
            });

        if (thread.creatorID != user.id) {
            throw new NoCreatorPermissionException(threadID);
        }

        if (data.tags != null) {
            const tags = data.tags.map((name) =>
                this.tagRepository.create({ name }),
            );

            await this.tagRepository.insertOrIgnore(tags);

            thread.tags = tags;
        }

        Object.assign(
            thread,
            this.objectManager.filterNullish({
                title: data.title,
            }),
        );

        await this.threadRepository.save(thread);
    }
}
