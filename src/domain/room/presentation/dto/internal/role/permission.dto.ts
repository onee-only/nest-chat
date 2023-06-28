import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PermissionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

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
    changeRole: boolean;
}
