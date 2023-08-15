import { User } from 'src/domain/user/entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class EmailConfirmation {
    @OneToOne(() => User)
    @JoinColumn({ name: 'userID' })
    user: User;

    @PrimaryColumn()
    token: string;

    @Column()
    expiration: Date;
}
