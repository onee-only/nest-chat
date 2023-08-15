import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateInvitationRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    roleAlias: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    duration: number;
}
