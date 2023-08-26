import { DataSource, Repository } from 'typeorm';
import { Embedment } from '../entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbedmentRepository extends Repository<Embedment> {
    constructor(private readonly dataSource: DataSource) {
        super(Embedment, dataSource.createEntityManager());
    }
}
