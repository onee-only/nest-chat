import { CreateThreadHandler } from './create-thread.handler';
import { DeleteThreadHandler } from './delete-thread.handler';
import { TogglePinHandler } from './toggle-pin.handler';
import { UpdateThreadHandler } from './update-thread.handler';

export const CommandHandlers = [
    CreateThreadHandler,
    DeleteThreadHandler,
    UpdateThreadHandler,
    TogglePinHandler,
];
