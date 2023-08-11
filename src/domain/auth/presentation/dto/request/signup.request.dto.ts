import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly nickname: string;
}
