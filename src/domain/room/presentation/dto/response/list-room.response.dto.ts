import { ApiProperty } from '@nestjs/swagger';
import { RoomListElement } from '../internal';

class ListInfo {
    @ApiProperty()
    public readonly pageNum: number;

    @ApiProperty()
    public readonly pageSize: number;

    @ApiProperty()
    public readonly totalPages: number;

    @ApiProperty()
    public readonly totalRooms: number;
}

export class ListRoomResponse {
    @ApiProperty({ type: [RoomListElement] })
    public readonly rooms: RoomListElement[];

    @ApiProperty()
    public readonly pageInfo: ListInfo;

    public static from(
        rooms: RoomListElement[],
        pageInfo: ListInfo,
    ): ListRoomResponse {
        return {
            pageInfo: pageInfo,
            rooms: rooms,
        };
    }
}
