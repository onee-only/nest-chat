import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRoleCommand } from '../create-role.command';
import { MemberRoleRepository, RoomRepository } from '../../repository';
import { PermissionChecker } from '../../util';
import { RoomPermission } from '../../enum';
import { RoomNotFoundException } from '../../exception';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly memberRoleRepository: MemberRoleRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(command: CreateRoleCommand): Promise<any> {
        const { alias, permission, roomID, user } = command;

        const room = await this.roomRepository.findOneBy({ id: roomID });

        if (room == null) {
            throw new RoomNotFoundException(roomID);
        }

        await this.permissionChecker.checkAvailableOrThrow(
            room,
            user,
            RoomPermission.MANAGE_ROLE,
        );

        const role = this.memberRoleRepository.create({
            alias,
            permission,
            room,
        });

        await this.memberRoleRepository.save(role);
    }
}
