import { ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/domain/room/entity';

class Owner {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly nickname: string;

    @ApiProperty()
    public readonly profileURL: string;
}

export class RetreiveRoomResponse {
    @ApiProperty()
    public readonly name: string;

    @ApiProperty()
    public readonly description: string;

    @ApiProperty()
    public readonly profileURL: string;

    @ApiProperty()
    public readonly isPublic: boolean;

    @ApiProperty()
    public readonly createdAt: Date;

    @ApiProperty()
    public readonly tags: string[];

    @ApiProperty()
    public readonly owner: Owner;

    public static from(room: Room): RetreiveRoomResponse {
        const { name, description, profileURL, isPublic, createdAt } = room;
        const {
            owner: { avatar, id: ownerID },
        } = room;

        const tags = room.tags.map((tag) => tag.name);

        return {
            name,
            description,
            profileURL,
            isPublic,
            createdAt,
            tags,
            owner: {
                id: ownerID,
                nickname: avatar.nickname,
                profileURL: avatar.profileURL,
            },
        };
    }
}
