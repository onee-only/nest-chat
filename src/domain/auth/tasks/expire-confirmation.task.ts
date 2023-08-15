import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailConfirmationRepository } from '../repository/email-confirmation.repository';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class ExpireConfirmationTask {
    constructor(
        private readonly emailConfirmationRepository: EmailConfirmationRepository,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async execute(): Promise<void> {
        this.emailConfirmationRepository.delete({
            expiration: LessThanOrEqual(new Date()),
        });
    }
}
