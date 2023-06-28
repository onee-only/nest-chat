import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Room } from '../entity';

@Injectable()
export class RoomRepository extends Repository<Room> {
    constructor(private readonly dataSource: DataSource) {
        super(Room, dataSource.createEntityManager());
    }

    async findOneWithOwnerById(id: number): Promise<Room> {
        return await this.findOne({
            where: { id },
            relations: { owner: true },
        });
    }
}
