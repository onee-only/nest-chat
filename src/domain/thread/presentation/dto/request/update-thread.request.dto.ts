import { IsOptional, IsString } from 'class-validator';

export class UpdateThreadRequestDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString({ each: true })
    tags?: string[];
}
