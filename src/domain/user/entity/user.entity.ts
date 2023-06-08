import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Avatar } from './avatar.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @CreateDateColumn()
    joinedAt: Date;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Avatar, (avatar) => avatar.user, {
        cascade: true,
        lazy: true,
    })
    avatar: Avatar;
}
