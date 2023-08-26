import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { RoomMember } from './room-member.entity';

export class Permission {
    @Column({ type: 'tinyint' })
    writeMessage: boolean;

    @Column({ type: 'tinyint' })
    deleteMessage: boolean;

    @Column({ type: 'tinyint' })
    inviteMember: boolean;

    @Column({ type: 'tinyint' })
    kickMember: boolean;

    @Column({ type: 'tinyint' })
    createThread: boolean;

    @Column({ type: 'tinyint' })
    manageRole: boolean;

    @Column({ type: 'tinyint' })
    manageTag: boolean;
}

@Entity()
export class MemberRole {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    roomID: number;

    @ManyToOne(() => Room, (room) => room.roles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roomID' })
    room: Room;

    @OneToMany(() => RoomMember, (member) => member.role)
    members: RoomMember[];

    @PrimaryColumn({ type: 'varchar', length: 30 })
    alias: string;

    @Column(() => Permission)
    permission: Permission;
}
