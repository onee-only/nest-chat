import { ChatInfo, UserInfo } from 'src/domain/thread/util/chat/types';

export class RetreiveSessionResponse {
    public readonly participants: UserInfo[];
    public readonly participantsCount: number;

    public static from(chatInfo: ChatInfo): RetreiveSessionResponse {
        return {
            participants: chatInfo.users,
            participantsCount: chatInfo.totalMembers,
        };
    }
}
