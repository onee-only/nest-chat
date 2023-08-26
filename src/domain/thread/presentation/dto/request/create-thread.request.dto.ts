import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateThreadRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    title: string;
}
