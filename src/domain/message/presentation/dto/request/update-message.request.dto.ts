import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    body: string;
}
