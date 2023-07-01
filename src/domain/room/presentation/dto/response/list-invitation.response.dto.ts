export type ListInvitationElement = {
    readonly token: string;
    readonly expiresAt: Date;
    readonly role: {
        readonly id: number;
        readonly alias: string;
    };
};

export class ListInvitationResponseDto {
    constructor(
        public readonly invitations: ListInvitationElement[],
        public readonly totalCount: number,
    ) {}

    public static from(
        invitations: ListInvitationElement[],
    ): ListInvitationResponseDto {
        return new ListInvitationResponseDto(invitations, invitations.length);
    }
}
