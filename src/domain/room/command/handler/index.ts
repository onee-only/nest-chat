import { CreateRoomHandler } from './create-room.handler';
import { DeleteRoomHandler } from './delete-room.handler';
import { UpdateRoomHandler } from './update-room.handler';

export const CommandHandlers = [
    CreateRoomHandler,
    UpdateRoomHandler,
    DeleteRoomHandler,
];
