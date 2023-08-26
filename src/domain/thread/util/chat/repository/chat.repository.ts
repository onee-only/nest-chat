import { Chat } from '../types/chat-session.types';

export class ChatRepository {
    chats: Map<string, Chat>;

    constructor() {
        this.chats = new Map<string, Chat>();
    }

    async find(key: string): Promise<Chat> {
        return this.chats.get(key);
    }

    async upsert(key: string, chat: Chat): Promise<void> {
        this.chats.set(key, chat);
    }

    async delete(key: string): Promise<void> {
        this.chats.delete(key);
    }
}
