import { Invitation } from 'src/domain/room/entity';

export class CreateInvitationResponse {
    constructor(
        public readonly token: string,
        public readonly expiresAt: Date,
    ) {}

    public static from(invitation: Invitation): CreateInvitationResponse {
        const { expiresAt, token } = invitation;
        return new CreateInvitationResponse(token, expiresAt);
    }
}
