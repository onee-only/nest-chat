import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateThreadRequest {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(80)
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    @MaxLength(20, { each: true })
    tags?: string[];
}
