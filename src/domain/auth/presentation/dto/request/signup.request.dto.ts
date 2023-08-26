import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    MaxLength,
} from 'class-validator';

export class SignupRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(254)
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(72)
    @IsStrongPassword()
    readonly password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    readonly nickname: string;
}
