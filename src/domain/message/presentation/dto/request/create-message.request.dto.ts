import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    body: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    replyTo?: string;
}
