import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MemberRole } from '../entity';

@Injectable()
export class MemberRoleRepository extends Repository<MemberRole> {
    constructor(private readonly dataSource: DataSource) {
        super(MemberRole, dataSource.createEntityManager());
    }
}
