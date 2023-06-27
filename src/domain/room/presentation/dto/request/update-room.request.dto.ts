import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateRoomRequestDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsUrl()
    profileURL?: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    defaultRoleID?: number;
}
