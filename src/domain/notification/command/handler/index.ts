import { ClearNotificationHandler } from './clear-notifications.handler';
import { NotifyMemberMentionHandler } from './notify-member-mention.handler';
import { NotifyReplyHandler } from './notify-reply.handler';
import { NotifyRoleMentionHandler } from './notify-role-mention.handler';

export const CommandHandlers = [
    NotifyRoleMentionHandler,
    NotifyMemberMentionHandler,
    NotifyReplyHandler,
    ClearNotificationHandler,
];
