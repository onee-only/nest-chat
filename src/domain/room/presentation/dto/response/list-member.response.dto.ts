import { RoomMember } from 'src/domain/room/entity';

export type MemberElementDto = {
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

export class ListMemberResponseDto {
    constructor(
        public readonly members: MemberElementDto[],
        public readonly totalCount: number,
    ) {}

    public static from(members: RoomMember[]): ListMemberResponseDto {
        const elements = members.map(
            ({ id, role, user: { id: userID, avatar } }): MemberElementDto => ({
                memberID: id,
                role: { ...role },
                user: { id: userID, ...avatar },
            }),
        );

        return new ListMemberResponseDto(elements, elements.length);
    }
}
