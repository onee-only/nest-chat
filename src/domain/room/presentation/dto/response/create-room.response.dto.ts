import { Room } from 'src/domain/room/entity';

export class CreateRoomResponse {
    constructor(
        public readonly roomID: number,
        public readonly roomName: string,
        public readonly profileURL: string,
        public readonly isPublic: boolean,
    ) {}

    public static from(room: Room): CreateRoomResponse {
        const { id, name, profileURL, isPublic } = room;
        return new CreateRoomResponse(id, name, profileURL, isPublic);
    }
}
