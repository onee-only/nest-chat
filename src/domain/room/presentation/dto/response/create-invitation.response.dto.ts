import { Invitation } from 'src/domain/room/entity';

export class CreateInvitationResponseDto {
    constructor(
        public readonly token: string,
        public readonly expiresAt: Date,
    ) {}

    public static from(invitation: Invitation): CreateInvitationResponseDto {
        const { expiresAt, token } = invitation;
        return new CreateInvitationResponseDto(token, expiresAt);
    }
}
