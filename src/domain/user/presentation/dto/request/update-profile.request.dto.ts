import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileRequestDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    nickname?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiProperty()
    @IsOptional()
    @IsUrl()
    profileURL?: string;
}
