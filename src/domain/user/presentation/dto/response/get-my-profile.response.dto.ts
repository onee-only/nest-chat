import { User } from 'src/domain/user/entity';

type DtoUser = {
    readonly id: number;
    readonly email: string;
    readonly joinedAt: Date;
};

type DtoProfile = {
    readonly nickname: string;
    readonly profileURL: string;
    readonly bio: string;
};

export class GetMyProfileResponseDto {
    constructor(
        public readonly user: DtoUser,
        public readonly profile: DtoProfile,
    ) {}

    public static from(user: User): GetMyProfileResponseDto {
        return new GetMyProfileResponseDto({ ...user }, { ...user.avatar });
    }
}
