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

    @CreateDateColumn({ type: 'datetime' })
    joinedAt: Date;

    @Column({ type: 'varchar2', length: 254, unique: true })
    email: string;

    @Column({ type: 'varchar2', length: 60 })
    password: string;

    @Column({ type: 'tinyint', default: false })
    isVerified: boolean;

    @OneToOne(() => Avatar, (avatar) => avatar.user, {
        cascade: true,
        eager: true,
    })
    avatar: Avatar;
}
