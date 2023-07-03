import { NotFoundException } from '@nestjs/common';

export class NoMathcingThreadException extends NotFoundException {
    constructor(roomID: number, threadID: number) {
        super(
            `thread: ${threadID} does not exist or is not a property of room: ${roomID}`,
        );
    }
}
