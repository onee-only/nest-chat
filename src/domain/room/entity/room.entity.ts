import {
    Column,
    CreateDateColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberRole } from './member-role.entity';
import { RoomMember } from './room-member.entity';

export class Room {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    profileURL: string;

    @Column()
    isPublic: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => MemberRole, { nullable: true, onDelete: 'SET NULL' })
    defaultRole: MemberRole;

    @OneToMany(() => MemberRole, (role) => role.room)
    roles: MemberRole[];

    @OneToMany(() => RoomMember, (member) => member.room)
    members: RoomMember[];
}
