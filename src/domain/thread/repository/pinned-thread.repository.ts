import { DataSource, Repository } from 'typeorm';
import { PinnedThread } from '../entity';

export class PinnedThreadRepository extends Repository<PinnedThread> {
    constructor(private readonly dataSource: DataSource) {
        super(PinnedThread, dataSource.createEntityManager());
    }
}
