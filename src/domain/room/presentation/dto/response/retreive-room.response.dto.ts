import { Room } from 'src/domain/room/entity';

type Owner = {
    readonly id: number;
    readonly nickname: string;
    readonly profileURL: string;
};

export class RetreiveRoomResponseDto {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly profileURL: string,
        public readonly isPublic: boolean,
        public readonly createdAt: Date,
        public readonly tags: string[],
        public readonly owner: Owner,
    ) {}

    public static from(room: Room): RetreiveRoomResponseDto {
        const { name, description, profileURL, isPublic, createdAt } = room;
        const {
            owner: { avatar, id: ownerID },
        } = room;

        const tags = room.tags.map((tag) => tag.name);

        return new RetreiveRoomResponseDto(
            name,
            description,
            profileURL,
            isPublic,
            createdAt,
            tags,
            { id: ownerID, ...avatar },
        );
    }
}
