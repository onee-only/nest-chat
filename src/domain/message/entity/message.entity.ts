import { MemberRole, RoomMember } from 'src/domain/room/entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Embedment } from './embedment.entity';
import { User } from 'src/domain/user/entity';
import { Thread } from 'src/domain/thread/entity';

@Entity()
export class Message {
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column({ type: 'bigint', unsigned: true, nullable: true })
    authorID: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'authorID' })
    author: User;

    @Column({ type: 'bigint', unsigned: true })
    threadID: number;

    @ManyToOne(() => Thread, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'threadID' })
    thread: Thread;

    @ManyToOne(() => Message, { onDelete: 'SET NULL', nullable: true })
    replyTo: Message;

    @Column()
    content: string;

    @Index()
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => RoomMember, { cascade: true })
    @JoinTable({ name: 'member_mentions' })
    mentionMembers: RoomMember[];

    @ManyToMany(() => MemberRole, { cascade: true })
    @JoinTable({ name: 'role_mentions' })
    mentionRoles: MemberRole[];

    @OneToMany(() => Embedment, (embedment) => embedment.message, {
        cascade: true,
    })
    embedments: Embedment[];
}
