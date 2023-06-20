import { User } from 'src/domain/user/entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class EmailConfirmation {
    @OneToOne(() => User)
    user: User;

    @Column()
    token: string;

    @Column()
    expiration: Date;
}
