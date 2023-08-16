import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';

export class GetMeResponse {
    @ApiProperty()
    public readonly userID: number;

    @ApiProperty()
    public readonly nickname: string;

    @ApiProperty()
    public readonly profileURL: string;

    public static async from(user: User): Promise<GetMeResponse> {
        const { id, avatar } = user;
        return {
            nickname: avatar.nickname,
            profileURL: avatar.profileURL,
            userID: id,
        };
    }
}
