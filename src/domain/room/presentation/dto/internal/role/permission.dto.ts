import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class Permission {
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    writeMessage: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    deleteMessage: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    inviteMember: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    kickMember: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    createThread: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    manageRole: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    manageTag: boolean;
}
