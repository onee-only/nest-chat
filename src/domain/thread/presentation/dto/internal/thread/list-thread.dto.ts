import { ApiProperty } from '@nestjs/swagger';

class CreatorElement {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly nickname: string;

    @ApiProperty()
    public readonly profileURL: string;
}

export class ListThreadElement {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly title: string;

    @ApiProperty()
    readonly createdAt: Date;

    @ApiProperty()
    readonly tags: string[];

    @ApiProperty()
    readonly messageCount: number;

    @ApiProperty()
    readonly participantCount: number;

    @ApiProperty()
    readonly creator: CreatorElement;
}
