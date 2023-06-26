import {
    Column,
    Generated,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { MemberRole } from './member-role.entity';

export class Invitation {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Generated('uuid')
    token: string;

    @ManyToOne(() => Room, {
        cascade: true,
        eager: true,
        nullable: false,
        onDelete: 'CASCADE',
    })
    room: Room;

    @OneToOne(() => MemberRole, {
        cascade: true,
        eager: true,
        nullable: true,
        onDelete: 'CASCADE',
    })
    role: MemberRole;

    @Column()
    expiresAt: Date;
}
