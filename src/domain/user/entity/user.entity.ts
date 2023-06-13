import {
    AfterInsert,
    AfterUpdate,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Avatar } from './avatar.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @CreateDateColumn()
    joinedAt: Date;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    isVerified: boolean;

    @OneToOne(() => Avatar, (avatar) => avatar.user, {
        cascade: true,
        lazy: true,
    })
    avatar: Avatar;
}
