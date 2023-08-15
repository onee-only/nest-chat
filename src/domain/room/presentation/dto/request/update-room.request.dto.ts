import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateRoomRequest {
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
    @IsString()
    defaultRoleAlias?: string;

    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];
}
