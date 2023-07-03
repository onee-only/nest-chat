import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Tag } from '../entity/tag.entity';

@Injectable()
export class TagRepository extends Repository<Tag> {
    constructor(private readonly dataSource: DataSource) {
        super(Tag, dataSource.createEntityManager());
    }

    async insertOrIgnore(tags: Tag[]): Promise<void> {
        await this.upsert(tags, { conflictPaths: { name: true } });
    }
}
