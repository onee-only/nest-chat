import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    MaxLength,
} from 'class-validator';

export class UpdatePasswordRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(72)
    @IsStrongPassword()
    currentPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(72)
    @IsStrongPassword()
    newPassword: string;
}
