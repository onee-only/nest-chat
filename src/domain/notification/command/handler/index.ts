import { NotifyMemberMentionHandler } from './notify-member-mention.handler';
import { NotifyRoleMentionHandler } from './notify-role-mention.handler';

export const CommandHandlers = [
    NotifyRoleMentionHandler,
    NotifyMemberMentionHandler,
];
