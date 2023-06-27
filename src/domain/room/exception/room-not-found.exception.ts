import { NotFoundException } from '@nestjs/common';

export class RoomNotFoundException extends NotFoundException {
    constructor(roomID: number) {
        super(`room with id: ${roomID} not found`);
    }
}
