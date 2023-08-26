import { ApiProperty } from '@nestjs/swagger';

class InviationRoleElement {
    @ApiProperty()
    public readonly alias: string;
}

export class ListInvitationElement {
    @ApiProperty()
    public readonly token: string;

    @ApiProperty()
    public readonly expiresAt: Date;

    @ApiProperty()
    public readonly role: InviationRoleElement;
}

export class ListInvitationResponse {
    @ApiProperty({ type: [ListInvitationElement] })
    public readonly invitations: ListInvitationElement[];

    @ApiProperty()
    public readonly totalCount: number;

    public static from(
        invitations: ListInvitationElement[],
    ): ListInvitationResponse {
        return { invitations, totalCount: invitations.length };
    }
}
