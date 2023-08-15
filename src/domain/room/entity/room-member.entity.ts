import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/domain/user/entity';
import { Room } from './room.entity';
import { MemberRole } from './member-role.entity';

@Entity()
export class RoomMember {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    userID: number;

    @PrimaryColumn({ type: 'bigint', unsigned: true })
    roomID: number;

    @ManyToOne(() => User, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userID' })
    user: User;

    @ManyToOne(() => Room, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'roomID' })
    room: Room;

    @ManyToOne(() => MemberRole, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    role: MemberRole;
}
