import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EmailConfirmation } from '../entity/email-confirmation.entity';

@Injectable()
export class EmailConfirmationRepository extends Repository<EmailConfirmation> {
    constructor(private readonly dataSource: DataSource) {
        super(EmailConfirmation, dataSource.createEntityManager());
    }
}
