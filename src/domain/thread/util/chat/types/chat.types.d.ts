import { Subject } from 'rxjs';

type SocketData = {
    readonly roomID: number;
    readonly threadID: number;
    readonly userID: number;
};

type Chat = {
    users: UserInfo[];
    events: Subject;
};

type ChatInfo = {
    users: UserInfo[];
    totalMembers: number;
};

type UserInfo = {
    readonly id: number;
    readonly nickname: string;
    readonly profileURL: string;
};

type LeaveInfo = {
    readonly id: number;
};

type TypingInfo = {
    readonly id: number;
};
