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
    @Column()
    writeMessage: boolean;

    @Column()
    deleteMessage: boolean;

    @Column()
    inviteMember: boolean;

    @Column()
    kickMember: boolean;

    @Column()
    createThread: boolean;

    @Column()
    manageRole: boolean;

    @Column()
    manageTag: boolean;
}

@Entity()
export class MemberRole {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    roomID: number;

    @ManyToOne(() => Room, (room) => room.roles)
    @JoinColumn({ name: 'roomID' })
    room: Room;

    @OneToMany(() => RoomMember, (member) => member.role)
    members: RoomMember[];

    @PrimaryColumn()
    alias: string;

    @Column(() => Permission)
    permission: Permission;
}
