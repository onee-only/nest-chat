import { ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/domain/room/entity';
import { User } from 'src/domain/user/entity';

export class MyRoomElement {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly name: string;

    @ApiProperty()
    public readonly profileURL: string;

    @ApiProperty()
    public readonly isOwner: boolean;
}

export class ListMyRoomResponse {
    @ApiProperty({ type: [MyRoomElement] })
    rooms: MyRoomElement[];

    public static from(rooms: Room[], user: User): ListMyRoomResponse {
        return {
            rooms: rooms.map((room) => ({
                id: room.id,
                name: room.name,
                profileURL: room.profileURL,
                isOwner: room.ownerID === user.id,
            })),
        };
    }
}
