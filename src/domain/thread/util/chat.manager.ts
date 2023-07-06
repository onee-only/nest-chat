import { Injectable } from '@nestjs/common';
import { RoomRepository } from 'src/domain/room/repository';
import { ThreadRepository } from '../repository';
import { PermissionChecker } from 'src/domain/room/util';
import {
    WsNoMatchingThreadException,
    WsNotRoomMemberException,
    WsRoomNotFoundException,
} from '../exception';
import { Socket } from 'socket.io';
import { User } from 'src/domain/user/entity';

type SocketData = {
    readonly roomID: number;
    readonly threadID: number;
    readonly userID: number;
    readonly nickname: string;
};

type UserOnInfo = {
    id: number;
    nickname: string;
    profileURL: string;
};

type UserOffInfo = {
    id: number;
};

@Injectable()
export class ChatManager {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly threadRepository: ThreadRepository,
        private readonly permissionChecker: PermissionChecker,
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
            nickname,
            roomID,
            threadID,
        };
        const userInfo: UserOnInfo = { id: user.id, nickname, profileURL };

        const roomName = this.genRoomName(room.id, thread.id);

        socket.data = socketData;
        socket.join(roomName);
        socket.to(roomName).emit('on', userInfo);
    }

    async leave(socket: Socket): Promise<void> {
        const { roomID, threadID, userID }: SocketData = socket.data;
        const roomName = this.genRoomName(roomID, threadID);

        const userInfo: UserOffInfo = { id: userID };

        socket.to(roomName).emit('off', userInfo);
        socket.leave(roomName);
    }

    async broadcastTyping(socket: Socket): Promise<void> {
        const { roomID, threadID, nickname }: SocketData = socket.data;

        socket
            .to(this.genRoomName(roomID, threadID))
            .emit('typing', { nickname });
    }

    private genRoomName(roomID: number, threadID: number): string {
        return `room:${roomID}/thread:${threadID}`;
    }
}
