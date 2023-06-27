import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Invitation } from '../entity';

@Injectable()
export class InvitationRepository extends Repository<Invitation> {
    constructor(private readonly dataSource: DataSource) {
        super(Invitation, dataSource.createEntityManager());
    }
}
