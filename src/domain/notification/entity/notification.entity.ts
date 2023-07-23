import { User } from 'src/domain/user/entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { NotificationType } from '../enum';
import { Thread } from 'src/domain/thread/entity';
import { Room } from 'src/domain/room/entity';
import { Message } from 'src/domain/message/entity';

@Entity()
export class Notification {
    @PrimaryColumn({ generated: 'uuid' })
    uuid: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    recipient: User;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    issuer: User;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'enum', enum: NotificationType })
    type: NotificationType;

    @Column()
    content: string;

    @ManyToOne(() => Room, { onDelete: 'SET NULL' })
    room: Room;

    @ManyToOne(() => Thread, { onDelete: 'SET NULL' })
    thread: Thread;

    @ManyToOne(() => Message, { onDelete: 'SET NULL' })
    message: Message;
}
