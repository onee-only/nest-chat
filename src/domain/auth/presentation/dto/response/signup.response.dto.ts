import { User } from 'src/domain/user/entity';

export class SignupResponseDto {
    constructor(public readonly userID: number) {}

    public static from(user: User): SignupResponseDto {
        return new SignupResponseDto(user.id);
    }
}
