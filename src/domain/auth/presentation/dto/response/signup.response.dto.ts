import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';

export class SignupResponse {
    @ApiProperty()
    public readonly userID: number;

    public static from(user: User): SignupResponse {
        return {
            userID: user.id,
        };
    }
}
