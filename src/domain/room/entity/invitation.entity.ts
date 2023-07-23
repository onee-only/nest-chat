import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Room } from './room.entity';
import { MemberRole } from './member-role.entity';

@Entity()
export class Invitation {
    @PrimaryColumn({ generated: 'uuid' })
    token: string;

    @ManyToOne(() => Room, {
        cascade: true,
        eager: true,
        nullable: false,
        onDelete: 'CASCADE',
    })
    room: Room;

    @OneToOne(() => MemberRole, {
        cascade: true,
        eager: true,
        nullable: true,
        onDelete: 'CASCADE',
    })
    role: MemberRole;

    @Column()
    expiresAt: Date;
}
