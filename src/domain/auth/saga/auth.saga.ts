import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';
import { UserCreatedEvent } from '../event';
import { SendEmailCommand } from '../command';

@Injectable()
export class AuthSaga {
    @Saga()
    sendEmailConfirmation(events$: Observable<any>): Observable<ICommand> {
        return events$.pipe(
            ofType(UserCreatedEvent),
            map(({ user }: UserCreatedEvent) => new SendEmailCommand(user)),
        );
    }
}
