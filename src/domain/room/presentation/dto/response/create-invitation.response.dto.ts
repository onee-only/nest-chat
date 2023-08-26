import { ApiProperty } from '@nestjs/swagger';
import { Invitation } from 'src/domain/room/entity';

export class CreateInvitationResponse {
    @ApiProperty()
    public readonly token: string;

    @ApiProperty()
    public readonly expiresAt: Date;

    public static from(invitation: Invitation): CreateInvitationResponse {
        const { expiresAt, token } = invitation;
        return { token, expiresAt };
    }
}
