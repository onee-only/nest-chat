import { Room } from 'src/domain/room/entity';

export class CreateRoomResponseDto {
    constructor(
        public readonly roomID: number,
        public readonly roomName: string,
        public readonly profileURL: string,
        public readonly isPublic: boolean,
    ) {}

    public static from(room: Room): CreateRoomResponseDto {
        const { id, name, profileURL, isPublic } = room;
        return new CreateRoomResponseDto(id, name, profileURL, isPublic);
    }
}
