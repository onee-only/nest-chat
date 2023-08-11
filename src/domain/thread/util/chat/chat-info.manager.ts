import { Injectable } from '@nestjs/common';
import { ChatRepository } from './repository';
import { ChatInfo } from './types';

@Injectable()
export class ChatInfoManager {
    constructor(private readonly chatRepository: ChatRepository) {}

    async getChatInfo(roomID: number, threadID: number): Promise<ChatInfo> {
        const chatName = this.genChatName(roomID, threadID);
        const chat = await this.chatRepository.find(chatName);
        if (chat === undefined) {
            return {
                users: [],
                totalMembers: 0,
            };
        }

        return {
            users: chat.users,
            totalMembers: chat.users.length,
        };
    }

    public genChatName(roomID: number, threadID: number): string {
        return `room:${roomID}/thread:${threadID}`;
    }
}
