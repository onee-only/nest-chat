import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
} from 'class-validator';

export class UpdateRoomRequest {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsUrl()
    @MaxLength(2048)
    profileURL?: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(30)
    defaultRoleAlias?: string;

    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    @MaxLength(20, { each: true })
    tags?: string[];
}
