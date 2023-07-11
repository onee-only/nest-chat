import { NotFoundException } from '@nestjs/common';

export class NoMatchingMessageException extends NotFoundException {
    constructor(threadID: number, messageID: number) {
        super(
            `message: ${messageID} does not exist or is not a property of thread: ${threadID}`,
        );
    }
}
