import {
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberRole } from './member-role.entity';
import { RoomMember } from './room-member.entity';
import { User } from 'src/domain/user/entity';

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

    @ManyToOne(() => User, { lazy: true, nullable: false })
    owner: User;

    @OneToOne(() => MemberRole, {
        cascade: true,
        nullable: true,
        onDelete: 'SET NULL',
    })
    defaultRole: MemberRole;

    @OneToMany(() => MemberRole, (role) => role.room, {
        cascade: true,
    })
    roles: MemberRole[];

    @OneToMany(() => RoomMember, (member) => member.room, {
        cascade: true,
    })
    members: RoomMember[];
}