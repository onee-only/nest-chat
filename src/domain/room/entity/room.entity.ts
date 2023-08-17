import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
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

@Entity()
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

    @ManyToOne(() => User, { nullable: false })
    owner: User;

    @OneToOne(() => MemberRole, {
        cascade: true,
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    defaultRole: MemberRole;

    @OneToMany(() => RoomMember, (member) => member.room, {
        cascade: true,
    })
    members: RoomMember[];

    @OneToMany(() => MemberRole, (role) => role.room, {
        cascade: true,
    })
    roles: MemberRole[];

    @OneToMany(() => Thread, (thread) => thread.room, {
        cascade: true,
    })
    threads: Thread[];

    @ManyToMany(() => Tag)
    @JoinTable({ name: 'room_tags' })
    tags: Tag[];
}
