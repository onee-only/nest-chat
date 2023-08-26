import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    NoOwnerPermissionException,
    RoomNotFoundException,
} from '../../exception';
import { DeleteRoomCommand } from '../delete-room.command';
import { RoomRepository } from '../../repository';

@CommandHandler(DeleteRoomCommand)
export class DeleteRoomHandler implements ICommandHandler<DeleteRoomCommand> {
    constructor(private readonly roomRepsitory: RoomRepository) {}

    async execute(command: DeleteRoomCommand): Promise<void> {
        const { roomID, user } = command;

        const room = await this.roomRepsitory
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        if (room.ownerID != user.id) {
            throw new NoOwnerPermissionException();
        }
        await this.roomRepsitory.delete(room.id);
    }
}
