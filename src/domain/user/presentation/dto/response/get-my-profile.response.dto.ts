import { Avatar, User } from 'src/domain/user/entity';

export class GetMyProfileResponseDto {
    user: {
        id: number;
        email: string;
        joinedAt: Date;
    };

    profile: {
        nickname: string;
        profileURL: string;
        bio: string;
    };

    public static from(user: User, avatar: Avatar): GetMyProfileResponseDto {
        const dto = new GetMyProfileResponseDto();
        dto.user = { ...user };
        dto.profile = { ...avatar };

        return dto;
    }
}
