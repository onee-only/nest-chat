import { Injectable, MessageEvent } from '@nestjs/common';
import { Notification } from '../entity';
import { Observable, Subject } from 'rxjs';
import { NotificationPayload } from '../presentation/dto/sse';

@Injectable()
export class NotifiactionPublisher {
    // TODO: probably have to make repository for this
    private sessions: Map<number, Subject<MessageEvent>>;

    constructor() {
        this.sessions = new Map<number, Subject<MessageEvent>>();
    }

    public subscribe(userID: number): Observable<MessageEvent> {
        const session = new Subject<MessageEvent>();
        this.sessions.set(userID, session);

        return session.asObservable();
    }

    public unsubscribe(userID: number): void {
        this.sessions.delete(userID);
    }

    public publish(...notifications: Notification[]): void {
        notifications.forEach((notification) => {
            const { recipient } = notification;

            const session = this.sessions.get(recipient.id);
            if (session == null) {
                return;
            }

            const payload: NotificationPayload = {
                data: {
                    ...notification,
                    message: {
                        ...notification.message,
                        author: { ...notification.message.author.avatar },
                        embedmentsCount: notification.message.embedments.length,
                    },
                },
                type: notification.type,
            };

            session.next(payload);
        });
    }
}
