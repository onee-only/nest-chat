export type ListInvitationElement = {
    readonly token: string;
    readonly expiresAt: Date;
    readonly role: {
        readonly alias: string;
    };
};

export class ListInvitationResponse {
    constructor(
        public readonly invitations: ListInvitationElement[],
        public readonly totalCount: number,
    ) {}

    public static from(
        invitations: ListInvitationElement[],
    ): ListInvitationResponse {
        return new ListInvitationResponse(invitations, invitations.length);
    }
}
