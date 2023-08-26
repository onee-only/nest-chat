import { ApiProperty } from '@nestjs/swagger';
class NestedRoomDto {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly name: string;

    @ApiProperty()
    public readonly profileURL: string;
}

class NestedThreadDto {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly title: string;
}

class NestedAuthorDto {
    @ApiProperty()
    public readonly nickname: string;

    @ApiProperty()
    public readonly profileURL: string;
}

class NestedMessagedto {
    @ApiProperty()
    public readonly id: string;

    @ApiProperty()
    public readonly content: string;

    @ApiProperty()
    public readonly createdAt: Date;

    @ApiProperty()
    public readonly updatedAt: Date;

    @ApiProperty()
    public readonly embedmentsCount: number;

    @ApiProperty()
    public readonly author: NestedAuthorDto;
}

export class NotificationDto {
    @ApiProperty()
    public readonly uuid: string;

    @ApiProperty()
    public readonly content: string;

    @ApiProperty()
    public readonly createdAt: Date;

    @ApiProperty()
    public readonly room: NestedRoomDto;

    @ApiProperty()
    public readonly thread: NestedThreadDto;

    @ApiProperty()
    public readonly message: NestedMessagedto;
}
