import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordRequest {
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}
