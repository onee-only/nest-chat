import { User } from 'src/domain/user/entity';

export class GetMeResponseDto {
    constructor(
        public readonly userID: number,
        public readonly nickname: string,
        public readonly profileURL: string,
    ) {}

    public static async from(user: User): Promise<GetMeResponseDto> {
        const {
            id,
            avatar: { nickname, profileURL },
        } = user;
        return new GetMeResponseDto(id, nickname, profileURL);
    }
}
