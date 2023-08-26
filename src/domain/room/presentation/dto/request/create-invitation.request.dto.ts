import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class CreateInvitationRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    roleAlias: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Max(Number.MAX_SAFE_INTEGER)
    duration: number;
}
