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
            data: { defaultRoleAlias },
        } = command;
        const { user, roomID, data } = command;

        const room = await this.roomRepsitory
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        if (room.ownerID != user.id) {
            throw new NoOwnerPermissionException();
        }

        if (defaultRoleAlias != null) {
            room.defaultRole = await this.getMemberRole(defaultRoleAlias, room);
            delete data.defaultRoleAlias;
        }

        if (data.tags != null) {
            const tags = data.tags.map((name) =>
                this.tagRepository.create({ name }),
            );

            await this.tagRepository.insertOrIgnore(tags);
            room.tags = tags;
        }
        delete data.tags;

        Object.assign(
            room,
            this.objectManager.filterNullish({
                ...data,
            }),
        );

        await this.roomRepsitory.save(room);
    }

    private async getMemberRole(
        alias: string,
        room: Room,
    ): Promise<MemberRole> {
        const role = await this.memberRoleRepository
            .findOneByOrFail({ roomID: room.id, alias })
            .catch(() => {
                throw new NoMatchingRoleException(room.id, alias);
            });

        return role;
    }
}
