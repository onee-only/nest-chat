import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SubscribeNotificationQuery } from '../subscribe-notification.query';
import { Observable } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { NotifiactionPublisher } from '../../util';

@QueryHandler(SubscribeNotificationQuery)
export class SubscribeNotificationHandler
    implements IQueryHandler<SubscribeNotificationQuery>
{
    constructor(
        private readonly notificationPublisher: NotifiactionPublisher,
    ) {}

    async execute(
        query: SubscribeNotificationQuery,
    ): Promise<Observable<MessageEvent>> {
        const { req, user } = query;

        const subject = await this.notificationPublisher.subscribe(user.id);
        req.on('close', () => {
            this.notificationPublisher.unsubscribe(user.id);
        });

        return subject;
    }
}
