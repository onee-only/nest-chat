import { WsException } from '@nestjs/websockets';

export class WsNoMatchingThreadException extends WsException {
    constructor(roomID: number, threadID: number) {
        super(
            `thread: ${threadID} does not exist or is not a property of room: ${roomID}`,
        );
    }
}
