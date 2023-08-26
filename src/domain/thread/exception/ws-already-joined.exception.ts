import { WsException } from '@nestjs/websockets';

export class WsAlreadyJoinedException extends WsException {
    constructor(roomID: number, threadID: number) {
        super(
            `you have already joined chat of name: room:${roomID}/thread:${threadID}.`,
        );
    }
}
