import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Room } from '../entity';

@Injectable()
export class RoomRepository extends Repository<Room> {
    constructor(private readonly dataSource: DataSource) {
        super(Room, dataSource.createEntityManager());
    }
}
