import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateThreadRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;
}
