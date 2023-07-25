import { NotFoundException } from '@nestjs/common';

export class NotificationNotFoundException extends NotFoundException {
    constructor(uuid: string) {
        super(`notification with uuid: ${uuid} not found in your inbox`);
    }
}
