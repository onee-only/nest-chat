import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entity';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private readonly dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async existsByEmail(email: string): Promise<boolean> {
        return await this.exist({ where: { email } });
    }

    async findIdByEmailAndPassword(
        email: string,
        password: string,
    ): Promise<number> {
        const user = await this.findOne({
            where: { email, password },
            select: { id: true },
        });
        return user?.id;
    }
}
