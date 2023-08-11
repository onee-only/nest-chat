import { RoomMember } from 'src/domain/room/entity';

export type MemberElement = {
    readonly memberID: number;

    readonly role: {
        readonly id: number;
        readonly alias: string;
    };

    readonly user: {
        readonly id: number;
        readonly nickname: string;
        readonly profileURL: string;
    };
};

export class ListMemberResponse {
    constructor(
        public readonly members: MemberElement[],
        public readonly totalCount: number,
    ) {}

    public static from(members: RoomMember[]): ListMemberResponse {
        const elements = members.map(
            ({ id, role, user: { id: userID, avatar } }): MemberElement => ({
                memberID: id,
                role: { ...role },
                user: { id: userID, ...avatar },
            }),
        );

        return new ListMemberResponse(elements, elements.length);
    }
}
