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

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @Column({ type: 'varchar', length: 2048 })
    profileURL: string;

    @Column({ type: 'tinyint' })
    isPublic: boolean;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @Column({ type: 'bigint', unsigned: true, nullable: false })
    ownerID: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'ownerID' })
    owner: User;

    @OneToOne(() => MemberRole, {
        cascade: true,
        nullable: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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
