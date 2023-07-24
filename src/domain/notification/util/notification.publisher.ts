import { Injectable } from '@nestjs/common';
import { Notification } from '../entity';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NotifiactionPublisher {
    sessions: Map<number, Subject<any>>;
    constructor() {
        this.sessions = new Map<number, Subject<any>>();
    }

    public subscribe(userID: number): Observable<any> {
        const session = new Subject();
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

            session.next(notification);
        });
    }
}
