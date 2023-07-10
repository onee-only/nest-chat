import { MemberRole, RoomMember } from 'src/domain/room/entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Embedment } from './embedment.entity';
import { User } from 'src/domain/user/entity';
import { Thread } from 'src/domain/thread/entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    author: User;

    @ManyToOne(() => Thread, { onDelete: 'CASCADE' })
    thread: Thread;

    @ManyToOne(() => Message, { onDelete: 'SET NULL', nullable: true })
    replyTo: Message;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => RoomMember, { cascade: true })
    mentionMembers: RoomMember[];

    @ManyToMany(() => MemberRole, { cascade: true })
    mentionRoles: MemberRole[];

    @OneToMany(() => Embedment, (embedment) => embedment.message, {
        onDelete: 'CASCADE',
    })
    embedments: Embedment[];
}
