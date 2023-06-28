import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRoomCommand } from '../create-room.command';
import { CreateRoomResponseDto } from '../../presentation/dto/response';
import {
    MemberRoleRepository,
    RoomMemberRepository,
    RoomRepository,
} from '../../repository';

@CommandHandler(CreateRoomCommand)
export class CreateRoomHandler implements ICommandHandler<CreateRoomCommand> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly memberRoleRepository: MemberRoleRepository,
    ) {}

    async execute(command: CreateRoomCommand): Promise<CreateRoomResponseDto> {
        const {
            roleInput: { roleName, rolePermission },
            roomInput,
        } = command;

        const room = this.roomRepository.create({
            ...roomInput,
        });

        const defaultRole = this.memberRoleRepository.create({
            alias: roleName,
            permission: { ...rolePermission },
        });

        const admin = this.roomMemberRepository.create({
            room: room,
            role: defaultRole,
            user: roomInput.owner,
        });

        room.defaultRole = defaultRole;
        room.roles.push(defaultRole);
        room.members.push(admin);

        await this.roomRepository.save(room);

        return CreateRoomResponseDto.from(room);
    }
}
