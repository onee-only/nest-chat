import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, filter, map } from 'rxjs';
import {
    MemberMentionedEvent,
    MessageCreatedEvent,
    MessageUpdatedEvent,
    ReplyCreatedEvent,
    RoleMentionedEvent,
} from '../event';
import { PublishMessageCommand, PublishUpdateCommand } from '../command';
import {
    NotifyMemberMentionCommand,
    NotifyReplyCommand,
    NotifyRoleMentionCommand,
} from 'src/domain/notification/command';

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

    @Saga()
    publishUpdateMessage(events$: Observable<any>): Observable<ICommand> {
        return events$.pipe(
            ofType(MessageUpdatedEvent),
            map(
                ({ room, thread, message }: MessageUpdatedEvent) =>
                    new PublishUpdateCommand(room, thread, message),
            ),
        );
    }

    @Saga()
    notifyRoleMention(events$: Observable<any>): Observable<ICommand> {
        return events$.pipe(
            ofType(RoleMentionedEvent),
            filter(({ roles }: RoleMentionedEvent) => roles.length !== 0),
            map(
                ({ room, roles, message }: RoleMentionedEvent) =>
                    new NotifyRoleMentionCommand(room, roles, message),
            ),
        );
    }

    @Saga()
    notifyMemberMention(events$: Observable<any>): Observable<ICommand> {
        return events$.pipe(
            ofType(MemberMentionedEvent),
            filter(({ members }: MemberMentionedEvent) => members.length !== 0),
            map(
                ({ room, members, message }: MemberMentionedEvent) =>
                    new NotifyMemberMentionCommand(room, members, message),
            ),
        );
    }

    @Saga()
    notifyReply(events$: Observable<any>): Observable<ICommand> {
        return events$.pipe(
            ofType(ReplyCreatedEvent),
            filter(({ reply }: ReplyCreatedEvent) => reply != null),
            map(
                ({ room, reply, target }: ReplyCreatedEvent) =>
                    new NotifyReplyCommand(room, target, reply),
            ),
        );
    }
}
