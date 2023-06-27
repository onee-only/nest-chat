import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRoomCommand } from '../delete-room.command';
import { RoomRepository } from '../../repository';
import { RoomAdminChecker } from '../../util';
import { RoomNotFoundException } from '../../exception';

@CommandHandler(DeleteRoomCommand)
export class DeleteRoomHandler implements ICommandHandler<DeleteRoomCommand> {
    constructor(
        private readonly roomRepsitory: RoomRepository,
        private readonly roomAdminChecker: RoomAdminChecker,
    ) {}

    async execute(command: DeleteRoomCommand): Promise<void> {
        const { roomID, user } = command;

        const room = await this.roomRepsitory.findOneBy({ id: roomID });
        if (room == null) {
            throw new RoomNotFoundException(roomID);
        }

        await this.roomAdminChecker.checkOrThrow(room, user);
        await this.roomRepsitory.delete(room);
    }
}
