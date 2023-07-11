import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    body: string;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    replyTo?: number;
}
