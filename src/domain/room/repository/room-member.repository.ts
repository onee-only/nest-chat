import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoomMember } from '../entity';

@Injectable()
export class RoomMemberRepository extends Repository<RoomMember> {
    constructor(private readonly dataSource: DataSource) {
        super(RoomMember, dataSource.createEntityManager());
    }
}
