import { ApiProperty } from '@nestjs/swagger';

class NestedOwner {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly nickname: string;

    @ApiProperty()
    public readonly profileURL: string;
}

export class RoomListElement {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly name: string;

    @ApiProperty()
    public readonly profileURL: string;

    @ApiProperty()
    public readonly description: string;

    @ApiProperty()
    public readonly memberCount: number;

    @ApiProperty()
    public readonly createdAt: Date;

    @ApiProperty()
    public readonly isMember: boolean;

    @ApiProperty()
    owner: NestedOwner;
}
