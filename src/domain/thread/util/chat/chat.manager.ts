import { Injectable } from '@nestjs/common';
import { RoomRepository } from 'src/domain/room/repository';
import { ThreadRepository } from '../../repository';
import { PermissionChecker } from 'src/domain/room/util';
import {
    WsAlreadyJoinedException,
    WsNoMatchingThreadException,
    WsNotRoomMemberException,
    WsRoomNotFoundException,
} from '../../exception';
import { Socket } from 'socket.io';
import { User } from 'src/domain/user/entity';

@Injectable()
export class ChatManager {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    // have to change it to external storage. in case the service scales up horizontally
    private readonly chats = new Map<string, Chat>();

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
        const chatName = this.genChatName(room.id, thread.id);

        let chat: Chat = this.chats.get(chatName);
        chat ??= { users: [] };

        if (chat.users.includes(userInfo)) {
            throw new WsAlreadyJoinedException(roomID, threadID);
        }
        chat.users.push(userInfo);
        this.chats.set(chatName, chat);

        socket.data = socketData;
        socket.join(chatName);
        socket.to(chatName).emit('on', userInfo);
    }

    async leave(socket: Socket): Promise<void> {
        const { roomID, threadID, userID }: SocketData = socket.data;
        const chatName = this.genChatName(roomID, threadID);

        const chat = this.chats.get(chatName);
        chat.users = chat.users.filter((userInfo) => userInfo.id !== userID);

        if (chat.users.length == 0) {
            this.chats.delete(chatName);
        } else {
            this.chats.set(chatName, chat);

            const leaveInfo: LeaveInfo = { id: userID };
            socket.to(chatName).emit('off', leaveInfo);
        }
        socket.leave(chatName);
    }

    async broadcastTyping(socket: Socket): Promise<void> {
        const { roomID, threadID, userID }: SocketData = socket.data;

        const chatName = this.genChatName(roomID, threadID);
        const typingInfo: TypingInfo = { id: userID };

        socket.to(chatName).emit('typing', typingInfo);
    }

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
        const chat = this.chats.get(chatName);
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

    isParticipating(user: User, roomID: number, threadID: number): boolean {
        const chatName = this.genChatName(roomID, threadID);

        const chat = this.chats.get(chatName);
        if (chat === undefined) return false;

        return chat.users.includes({
            id: user.id,
            nickname: user.avatar.nickname,
            profileURL: user.avatar.profileURL,
        });
    }

    private genChatName(roomID: number, threadID: number): string {
        return `room:${roomID}/thread:${threadID}`;
    }
}
