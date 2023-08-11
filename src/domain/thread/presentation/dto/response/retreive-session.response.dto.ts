import { ChatInfo, UserInfo } from 'src/domain/thread/util/chat/types';

export class RetreiveSessionResponseDto {
    public readonly participants: UserInfo[];
    public readonly participantsCount: number;

    public static from(chatInfo: ChatInfo): RetreiveSessionResponseDto {
        return {
            participants: chatInfo.users,
            participantsCount: chatInfo.totalMembers,
        };
    }
}
