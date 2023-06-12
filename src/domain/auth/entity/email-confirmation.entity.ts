import { User } from 'src/domain/user/entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class EmailComfirmation {
    @OneToOne(() => User)
    user: User;

    @Column()
    token: string;

    @Column()
    expiration: Date;
}
