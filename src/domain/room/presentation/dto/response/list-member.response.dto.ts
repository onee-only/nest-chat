import { ApiProperty } from '@nestjs/swagger';
import { RoomMember } from 'src/domain/room/entity';

class MemberRoleElement {
    @ApiProperty()
    public readonly alias: string;
}

class UserElement {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly nickname: string;

    @ApiProperty()
    public readonly profileURL: string;
}
class MemberElement {
    @ApiProperty()
    public readonly role: MemberRoleElement;

    @ApiProperty()
    public readonly user: UserElement;
}

export class ListMemberResponse {
    @ApiProperty({ type: [MemberElement] })
    public readonly members: MemberElement[];

    @ApiProperty()
    public readonly totalCount: number;

    public static from(members: RoomMember[]): ListMemberResponse {
        const elements = members.map(
            ({ role, user: { id: userID, avatar } }): MemberElement => ({
                role: { alias: role.alias },
                user: { id: userID, ...avatar },
            }),
        );

        return { members: elements, totalCount: elements.length };
    }
}
