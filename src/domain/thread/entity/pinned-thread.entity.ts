import { Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Thread } from './thread.entity';

@Entity()
export class PinnedThread {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    threadID: number;

    @OneToOne(() => Thread)
    thread: Thread;
}
