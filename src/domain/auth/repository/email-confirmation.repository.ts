import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EmailComfirmation } from '../entity/email-confirmation.entity';

@Injectable()
export class EmailComfirmationRepository extends Repository<EmailComfirmation> {
    constructor(private readonly dataSource: DataSource) {
        super(EmailComfirmation, dataSource.createEntityManager());
    }
}
