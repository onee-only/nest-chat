import { User } from 'src/domain/user/entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class EmailConfirmation {
    @OneToOne(() => User)
    user: User;

    @PrimaryColumn()
    token: string;

    @Column()
    expiration: Date;
}
