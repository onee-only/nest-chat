import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoomCommand } from '../update-room.command';
import { MemberRoleRepository, RoomRepository } from '../../repository';
import { MemberRole, Room } from '../../entity';
import {
    NoMatchingRoleException,
    NoOwnerPermissionException,
    RoomNotFoundException,
} from '../../exception';
import { ObjectManager } from 'src/global/modules/utils';
import { TagRepository } from 'src/domain/tag/repository/tag.repository';

@CommandHandler(UpdateRoomCommand)
export class UpdateRoomHandler implements ICommandHandler<UpdateRoomCommand> {
    constructor(
        private readonly roomRepsitory: RoomRepository,
        private readonly memberRoleRepository: MemberRoleRepository,
        private readonly tagRepository: TagRepository,
        private readonly objectManager: ObjectManager,
    ) {}

    async execute(command: UpdateRoomCommand): Promise<void> {
        const {
            data: { defaultRoleAlias, tags: tagNames },
        } = command;
        const { user, roomID, data } = command;

        const room = await this.roomRepsitory
            .findOneWithOwnerById(roomID)
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        if (room.owner != user) {
            throw new NoOwnerPermissionException();
        }

        if (defaultRoleAlias != null) {
            room.defaultRole = await this.getMemberRole(defaultRoleAlias, room);
            delete data.defaultRoleAlias;
        }

        // should refactor it. update thread too.
        const tags = tagNames.map((name) =>
            this.tagRepository.create({ name }),
        );
        if (tagNames != null) {
            await this.tagRepository.insertOrIgnore(tags);
        }
        delete data.tags;

        const candiate = this.objectManager.filterNullish({
            tags: tags,
            ...data,
        });
        Object.assign(room, candiate);

        await this.roomRepsitory.save(room);
    }

    private async getMemberRole(
        alias: string,
        room: Room,
    ): Promise<MemberRole> {
        const role = await this.memberRoleRepository
            .findOneByOrFail({ room, alias })
            .catch(() => {
                throw new NoMatchingRoleException(room.id, alias);
            });

        return role;
    }
}
