import { RoomMember } from 'src/domain/room/entity';

export type MemberElement = {
    readonly role: {
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
            ({ role, user: { id: userID, avatar } }): MemberElement => ({
                role: { alias: role.alias },
                user: { id: userID, ...avatar },
            }),
        );

        return new ListMemberResponse(elements, elements.length);
    }
}
