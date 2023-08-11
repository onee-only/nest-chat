import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateThreadRequest {
    @ApiProperty()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];
}
