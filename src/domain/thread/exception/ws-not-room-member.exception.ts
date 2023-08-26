import { WsException } from '@nestjs/websockets';

export class WsNotRoomMemberException extends WsException {
    constructor() {
        super('you are not a member of this room');
    }
}
