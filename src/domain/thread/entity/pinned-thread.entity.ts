import { Entity, OneToOne } from 'typeorm';
import { Thread } from './thread.entity';

@Entity()
export class PinnedThread {
    @OneToOne(() => Thread)
    thread: Thread;
}
