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
        const {
            user,
            roomID,
            threadID,
            data: { tags: tagNames, title },
        } = command;

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

        const tags = tagNames.map((name) =>
            this.tagRepository.create({ name }),
        );
        if (tagNames != null) {
            await this.tagRepository.insertOrIgnore(tags);
        }

        const candiate = this.objectManager.filterNullish({
            tags: tagNames ? tags : null,
            title: title,
        });

        Object.assign(thread, candiate);

        await this.threadRepository.save(thread);
    }
}
