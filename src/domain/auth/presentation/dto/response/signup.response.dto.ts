import { User } from 'src/domain/user/entity';

export class SignupResponse {
    constructor(public readonly userID: number) {}

    public static from(user: User): SignupResponse {
        return new SignupResponse(user.id);
    }
}
