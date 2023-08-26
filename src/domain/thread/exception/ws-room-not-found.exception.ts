import { WsException } from '@nestjs/websockets';

export class WsRoomNotFoundException extends WsException {
    constructor(roomID: number) {
        super(`room: ${roomID} does not exist`);
    }
}
