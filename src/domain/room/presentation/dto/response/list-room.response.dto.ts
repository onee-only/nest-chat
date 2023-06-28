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
        public readonly pageNum: number,
        public readonly pageSize: number,
        public readonly totalPages: number,
        public readonly totalRooms: number,
    ) {}

    public static from(
        rooms: RoomListElementDto[],
        pageInfo: ListInfo,
    ): ListRoomResponseDto {
        const { pageNum, totalPages, totalRooms, pageSize } = pageInfo;
        return new ListRoomResponseDto(
            rooms,
            pageNum,
            pageSize,
            totalPages,
            totalRooms,
        );
    }
}
