import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateInvitationRequestDto {
    @ApiProperty()
    @IsInt()
    roleID: number;

    @ApiProperty()
    @IsInt()
    duration: number;
}
