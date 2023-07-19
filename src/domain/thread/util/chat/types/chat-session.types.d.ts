import { Subject } from 'rxjs';

export type SocketData = {
    readonly roomID: number;
    readonly threadID: number;
    readonly userID: number;
};

export type Chat = {
    users: UserInfo[];
    events: Subject<MessagePayload>;
};

export type ChatInfo = {
    users: UserInfo[];
    totalMembers: number;
};

export type UserInfo = {
    readonly id: number;
    readonly nickname: string;
    readonly profileURL: string;
};

export type LeaveInfo = {
    readonly id: number;
};

export type TypingInfo = {
    readonly id: number;
};
