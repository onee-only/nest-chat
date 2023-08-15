import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Avatar {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    userID: number;

    @Column({ unique: true })
    nickname: string;

    @Column({ default: '' })
    bio: string;

    @Column({ default: '' })
    profileURL: string;

    @OneToOne(() => User, (user) => user.avatar)
    @JoinColumn({ name: 'userID' })
    user: User;
}
