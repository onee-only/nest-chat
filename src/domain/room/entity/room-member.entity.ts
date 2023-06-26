import { ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/domain/user/entity';
import { Room } from './room.entity';
import { MemberRole } from './member-role.entity';

export class RoomMember {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @ManyToOne(() => User, {
        cascade: true,
        nullable: false,
        onDelete: 'CASCADE',
        eager: true,
    })
    user: User;

    @ManyToOne(() => Room, {
        cascade: true,
        nullable: false,
        onDelete: 'CASCADE',
    })
    room: Room;

    @ManyToOne(() => MemberRole, {
        cascade: true,
        nullable: false,
        onDelete: 'CASCADE',
    })
    role: MemberRole;
}
