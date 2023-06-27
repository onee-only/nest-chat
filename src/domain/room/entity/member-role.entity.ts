import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';
import { RoomMember } from './room-member.entity';

class Permission {
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
    changeRole: boolean;
}

export class MemberRole {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @ManyToOne(() => Room, (room) => room.roles)
    room: Room;

    @OneToMany(() => RoomMember, (member) => member.role)
    members: RoomMember[];

    @Column()
    alias: string;

    @Column(() => Permission)
    permission: Permission;
}
