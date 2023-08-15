import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Thread } from './thread.entity';

@Entity()
export class PinnedThread {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    threadID: number;

    @OneToOne(() => Thread)
    @JoinColumn({ name: 'threadID' })
    thread: Thread;
}
