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
            const { recipient, message, thread, room } = notification;

            const session = this.sessions.get(recipient.id);
            if (session == null) return;

            const payload: NotificationPayload = {
                data: {
                    uuid: notification.uuid,
                    content: notification.content,
                    createdAt: notification.createdAt,
                    room: {
                        id: room.id,
                        name: room.name,
                        profileURL: room.profileURL,
                    },
                    thread: {
                        id: thread.id,
                        title: thread.title,
                    },
                    message: {
                        content: message.content,
                        createdAt: message.createdAt,
                        id: message.id,
                        updatedAt: message.updatedAt,
                        author: {
                            nickname: message.author.avatar.nickname,
                            profileURL: message.author.avatar.profileURL,
                        },
                        embedmentsCount: message.embedments.length,
                    },
                },
                type: notification.type,
            };

            session.next(payload);
        });
    }
}
