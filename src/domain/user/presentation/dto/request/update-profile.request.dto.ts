import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateProfileRequest {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(30)
    nickname?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(300)
    bio?: string;

    @ApiProperty()
    @IsOptional()
    @IsUrl()
    @MaxLength(2048)
    profileURL?: string;
}
