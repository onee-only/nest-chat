import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Avatar } from '../entity';

@Injectable()
export class AvatarRepository extends Repository<Avatar> {
    constructor(private readonly dataSource: DataSource) {
        super(Avatar, dataSource.createEntityManager());
    }

    async existsByNickname(nickname: string): Promise<boolean> {
        return await this.exist({ where: { nickname } });
    }
}
