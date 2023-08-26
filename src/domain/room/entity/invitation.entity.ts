import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Room } from './room.entity';
import { MemberRole } from './member-role.entity';

@Entity()
export class Invitation {
    @PrimaryColumn({ type: 'uuid' })
    token: string;

    @Column({ type: 'bigint', unsigned: true })
    roomID: number;

    @ManyToOne(() => Room, {
        cascade: true,
        eager: true,
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'roomID' })
    room: Room;

    @ManyToOne(() => MemberRole, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    role: MemberRole;

    @Column()
    expiresAt: Date;
}
