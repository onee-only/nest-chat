import { User } from 'src/domain/user/entity';

export class GetMeResponse {
    constructor(
        public readonly userID: number,
        public readonly nickname: string,
        public readonly profileURL: string,
    ) {}

    public static async from(user: User): Promise<GetMeResponse> {
        const {
            id,
            avatar: { nickname, profileURL },
        } = user;
        return new GetMeResponse(id, nickname, profileURL);
    }
}
