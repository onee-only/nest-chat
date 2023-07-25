import { MessageEvent } from '@nestjs/common';
import { NotificationDto } from '../internal';

export class NotificationPayload implements MessageEvent {
    readonly data: NotificationDto;
    readonly type?: string;
}
