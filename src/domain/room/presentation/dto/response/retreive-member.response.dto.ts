import { ApiProperty } from '@nestjs/swagger';
import { RoomMember } from 'src/domain/room/entity';

export class RetreiveMemberResponse {
    @ApiProperty()
    public readonly nickname: string;

    @ApiProperty()
    public readonly bio: string;

    @ApiProperty()
    public readonly profileURL: string;

    public static from(member: RoomMember): RetreiveMemberResponse {
        return {
            nickname: member.user.avatar.nickname,
            profileURL: member.user.avatar.profileURL,
            bio: member.user.avatar.bio,
        };
    }
}
