import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/domain/user/entity';
import { Room } from './room.entity';
import { MemberRole } from './member-role.entity';

@Entity()
export class RoomMember {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @ManyToOne(() => User, {
        cascade: true,
        nullable: false,
        onDelete: 'CASCADE',
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
        onDelete: 'RESTRICT',
    })
    role: MemberRole;
}
