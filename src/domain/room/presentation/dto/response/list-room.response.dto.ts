import { RoomListElement } from '../internal';

type ListInfo = {
    readonly pageNum: number;
    readonly pageSize: number;
    readonly totalPages: number;
    readonly totalRooms: number;
};

export class ListRoomResponse {
    constructor(
        public readonly rooms: RoomListElement[],
        public readonly pageInfo: ListInfo,
    ) {}

    public static from(
        rooms: RoomListElement[],
        pageInfo: ListInfo,
    ): ListRoomResponse {
        return new ListRoomResponse(rooms, pageInfo);
    }
}
