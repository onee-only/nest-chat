import {
    Column,
    CreateDateColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberRole } from './member-role.entity';
import { RoomMember } from './room-member.entity';
import { User } from 'src/domain/user/entity';
import { Tag } from 'src/domain/tag/entity/tag.entity';
import { Thread } from 'src/domain/thread/entity';

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
        onDelete: 'CASCADE',
    })
    roles: MemberRole[];

    @OneToMany(() => RoomMember, (member) => member.room, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    members: RoomMember[];

    @OneToMany(() => Thread, (thread) => thread.room, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    threads: Thread[];

    @ManyToMany(() => Tag, { lazy: true })
    tags: Tag[];
}
