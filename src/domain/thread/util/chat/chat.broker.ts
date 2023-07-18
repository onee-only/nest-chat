import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { RoomRepository } from 'src/domain/room/repository';
import { ThreadRepository } from '../../repository';
import { ChatRepository } from './repository/chat.repository';
import { PermissionChecker } from 'src/domain/room/util';
import {
    WsAlreadyJoinedException,
    WsNoMatchingThreadException,
    WsNotRoomMemberException,
    WsRoomNotFoundException,
} from '../../exception';
import { User } from 'src/domain/user/entity';
import { ChatInfoManager } from './chat-info.manager';
import {
    Chat,
    LeaveInfo,
    SocketData,
    TypingInfo,
    UserInfo,
} from './types/chat.types';
import { Subject } from 'rxjs';

@Injectable()
export class ChatBroker {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly chatRepository: ChatRepository,

        private readonly permissionChecker: PermissionChecker,
        private readonly chatInfoManager: ChatInfoManager,
    ) {}

    async join(
        socket: Socket,
        user: User,
        roomID: number,
        threadID: number,
    ): Promise<void> {
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

        const { nickname, profileURL } = user.avatar;
        const socketData: SocketData = {
            userID: user.id,
            roomID,
            threadID,
        };

        const userInfo: UserInfo = { id: user.id, nickname, profileURL };
        const chatName = this.chatInfoManager.genChatName(room.id, thread.id);

        let chat: Chat = await this.chatRepository.find(chatName);
        chat ??= { users: [], events: new Subject() };

        if (chat.users.includes(userInfo)) {
            throw new WsAlreadyJoinedException(roomID, threadID);
        }
        chat.users.push(userInfo);

        await this.chatRepository.upsert(chatName, chat);

        socket.data = socketData;
        socket.join(chatName);
        socket.to(chatName).emit('on', userInfo);
    }

    async leave(socket: Socket): Promise<void> {
        const { roomID, threadID, userID }: SocketData = socket.data;
        const chatName = this.chatInfoManager.genChatName(roomID, threadID);

        const chat = await this.chatRepository.find(chatName);
        chat.users = chat.users.filter((userInfo) => userInfo.id !== userID);

        if (chat.users.length == 0) {
            await this.chatRepository.delete(chatName);
        } else {
            await this.chatRepository.upsert(chatName, chat);

            const leaveInfo: LeaveInfo = { id: userID };
            socket.to(chatName).emit('off', leaveInfo);
        }
        socket.leave(chatName);
    }

    async broadcastTyping(socket: Socket): Promise<void> {
        const { roomID, threadID, userID }: SocketData = socket.data;

        const chatName = this.chatInfoManager.genChatName(roomID, threadID);
        const typingInfo: TypingInfo = { id: userID };

        socket.to(chatName).emit('typing', typingInfo);
    }

    public async isParticipating(
        user: User,
        roomID: number,
        threadID: number,
    ): Promise<boolean> {
        const chatName = this.chatInfoManager.genChatName(roomID, threadID);

        const chat = await this.chatRepository.find(chatName);
        if (chat === undefined) return false;

        return chat.users.includes({
            id: user.id,
            nickname: user.avatar.nickname,
            profileURL: user.avatar.profileURL,
        });
    }
}
