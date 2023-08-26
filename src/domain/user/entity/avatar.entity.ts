import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Avatar {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    userID: number;

    @Column({ type: 'varchar', length: 30, unique: true })
    nickname: string;

    @Column({ type: 'varchar', length: 300, default: '' })
    bio: string;

    @Column({ type: 'varchar', length: 2048, default: '' })
    profileURL: string;

    @OneToOne(() => User, (user) => user.avatar)
    @JoinColumn({ name: 'userID' })
    user: User;
}
