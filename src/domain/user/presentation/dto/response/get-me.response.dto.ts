import { Avatar, User } from 'src/domain/user/entity';

export class GetMeResponseDto {
    constructor(
        public readonly userID: number,
        public readonly nickname: string,
        public readonly profileURL: string,
    ) {}

    public static async from(
        user: User,
        avatar: Avatar,
    ): Promise<GetMeResponseDto> {
        const { id } = user;
        const { nickname, profileURL } = avatar;
        return new GetMeResponseDto(id, nickname, profileURL);
    }
}
