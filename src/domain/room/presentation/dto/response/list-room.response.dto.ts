import { RoomListElementDto } from '../internal';

type ListInfo = {
    readonly pageNum: number;
    readonly pageSize: number;
    readonly totalPages: number;
    readonly totalRooms: number;
};

export class ListRoomResponseDto {
    constructor(
        public readonly rooms: RoomListElementDto[],
        public readonly pageInfo: ListInfo,
    ) {}

    public static from(
        rooms: RoomListElementDto[],
        pageInfo: ListInfo,
    ): ListRoomResponseDto {
        return new ListRoomResponseDto(rooms, pageInfo);
    }
}
