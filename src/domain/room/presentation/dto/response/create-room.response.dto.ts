import { ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/domain/room/entity';

export class CreateRoomResponse {
    @ApiProperty()
    public readonly roomID: number;

    @ApiProperty()
    public readonly roomName: string;

    @ApiProperty()
    public readonly profileURL: string;

    @ApiProperty()
    public readonly isPublic: boolean;

    public static from(room: Room): CreateRoomResponse {
        const { id, name, profileURL, isPublic } = room;
        return {
            roomID: id,
            roomName: name,
            profileURL,
            isPublic,
        };
    }
}
