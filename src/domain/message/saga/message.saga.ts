import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, filter, map } from 'rxjs';
import {
    MemberMentionedEvent,
    MessageCreatedEvent,
    ReplyCreatedEvent,
    RoleMentionedEvent,
} from '../event';
import { PublishMessageCommand } from '../command';

@Injectable()
export class MessageSaga {
    @Saga()
    publishMessage(events$: Observable<any>): Observable<ICommand> {
        return events$.pipe(
            ofType(MessageCreatedEvent),
            map(
                ({ room, message }: MessageCreatedEvent) =>
                    new PublishMessageCommand(room, message),
            ),
        );
    }

    // @Saga()
    // notifyRoleMention(events$: Observable<any>): Observable<ICommand> {
    //     return events$.pipe(
    //         ofType(RoleMentionedEvent),
    //         filter(({ roles }: RoleMentionedEvent) => roles.length !== 0),
    //         map(
    //             ({ room, roles, message }: RoleMentionedEvent) =>
    //                 new SendEmailCommand(user),
    //         ),
    //     );
    // }

    // @Saga()
    // notifyMemberMention(events$: Observable<any>): Observable<ICommand> {
    //     return events$.pipe(
    //         ofType(MemberMentionedEvent),
    //         filter(({ members }: MemberMentionedEvent) => members.length !== 0),
    //         map(
    //             ({ room, members, message }: MemberMentionedEvent) =>
    //                 new SendEmailCommand(user),
    //         ),
    //     );
    // }

    // @Saga()
    // notifyReply(events$: Observable<any>): Observable<ICommand> {
    //     return events$.pipe(
    //         ofType(ReplyCreatedEvent),
    //         filter(({ reply }: ReplyCreatedEvent) => reply != null),
    //         map(
    //             ({ room, reply, target }: ReplyCreatedEvent) =>
    //                 new SendEmailCommand(user),
    //         ),
    //     );
    // }
}