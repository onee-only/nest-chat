import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from '../entity';
import { EmailConfirmation } from 'src/domain/auth/entity/email-confirmation.entity';

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

    async verifyEmail(user: User): Promise<void> {
        await this.dataSource.transaction(
            'READ COMMITTED',
            async (entityManager: EntityManager) => {
                await entityManager.update(User, user.id, {
                    isVerified: true,
                });
                await entityManager.delete(EmailConfirmation, {
                    user: user,
                });
            },
        );
    }
}
