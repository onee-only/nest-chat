import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    MaxLength,
} from 'class-validator';

export class LoginRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(254)
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(72)
    @IsStrongPassword()
    password: string;
}
