import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvitationRepository } from '../repository';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class ExpireInvitationTask {
    constructor(private readonly invitationRepository: InvitationRepository) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async execute(): Promise<void> {
        await this.invitationRepository.delete({
            expiresAt: LessThanOrEqual(new Date()),
        });
    }
}
