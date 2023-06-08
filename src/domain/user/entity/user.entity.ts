import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Avatar } from './avatar.entity';

export abstract class BaseUser {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @CreateDateColumn()
    joinedAt: Date;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Avatar, (avatar) => avatar.user)
    avatar: Avatar;
}

@Entity()
export class User extends BaseUser {}
