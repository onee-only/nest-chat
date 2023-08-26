import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRoomCommand } from '../create-room.command';
import { CreateRoomResponse } from '../../presentation/dto/response';
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

    async execute(command: CreateRoomCommand): Promise<CreateRoomResponse> {
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

        room.defaultRole = defaultRole;
        room.roles = [defaultRole];

        const createdRoom = await this.roomRepository.save(room);

        const admin = this.roomMemberRepository.create({
            room: createdRoom,
            role: defaultRole,
            user: roomInput.owner,
        });
        await this.roomMemberRepository.save(admin);

        return CreateRoomResponse.from(room);
    }
}
