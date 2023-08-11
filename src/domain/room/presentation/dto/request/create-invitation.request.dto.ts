import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateInvitationRequest {
    @ApiProperty()
    @IsInt()
    roleID: number;

    @ApiProperty()
    @IsInt()
    duration: number;
}
