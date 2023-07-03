import { ForbiddenException } from '@nestjs/common';

export class NoCreatorPermissionException extends ForbiddenException {
    constructor(threadID: number) {
        super(`you are not a creator of thread: ${threadID}`);
    }
}
