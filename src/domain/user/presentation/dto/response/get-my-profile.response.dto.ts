import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';

class DtoUser {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly joinedAt: Date;
}

class DtoProfile {
    @ApiProperty()
    public readonly nickname: string;

    @ApiProperty()
    public readonly profileURL: string;

    @ApiProperty()
    public readonly bio: string;
}

export class GetMyProfileResponse {
    @ApiProperty()
    public readonly user: DtoUser;

    @ApiProperty()
    public readonly profile: DtoProfile;

    public static from(user: User): GetMyProfileResponse {
        const { avatar, email, id, joinedAt } = user;
        return {
            user: { id, email, joinedAt },
            profile: {
                nickname: avatar.nickname,
                profileURL: avatar.profileURL,
                bio: avatar.bio,
            },
        };
    }
}
