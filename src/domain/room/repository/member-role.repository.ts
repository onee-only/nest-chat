import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MemberRole, Room } from '../entity';

@Injectable()
export class MemberRoleRepository extends Repository<MemberRole> {
    constructor(private readonly dataSource: DataSource) {
        super(MemberRole, dataSource.createEntityManager());
    }

    async duplicateAliasExists(room: Room, alias: string): Promise<boolean> {
        return await this.exist({ where: { room, alias } });
    }
}
