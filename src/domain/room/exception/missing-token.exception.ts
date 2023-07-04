import { BadRequestException } from '@nestjs/common';

export class MissingTokenException extends BadRequestException {
    constructor(roomID: number) {
        super(`room: ${roomID} needs invitation token. but none have given`);
    }
}
