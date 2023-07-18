import { Injectable } from '@nestjs/common';
import { RoomRepository } from 'src/domain/room/repository';
import { ThreadRepository } from '../../repository';
import { PermissionChecker } from 'src/domain/room/util';
import {
    WsNoMatchingThreadException,
    WsNotRoomMemberException,
    WsRoomNotFoundException,
} from '../../exception';

import { User } from 'src/domain/user/entity';
import { ChatRepository } from './repository';
import { ChatInfo } from './types/chat.types';

@Injectable()
export class ChatInfoManager {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly chatRepository: ChatRepository,

        private readonly permissionChecker: PermissionChecker,
    ) {}

    async getChatInfo(
        user: User,
        roomID: number,
        threadID: number,
    ): Promise<ChatInfo> {
        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new WsRoomNotFoundException(roomID);
            });

        const thread = await this.threadRepository
            .findOneByOrFail({ room, id: threadID })
            .catch(() => {
                throw new WsNoMatchingThreadException(roomID, threadID);
            });

        const available = await this.permissionChecker.check({ room, user });
        if (!available) {
            throw new WsNotRoomMemberException();
        }

        const chatName = this.genChatName(room.id, thread.id);
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
