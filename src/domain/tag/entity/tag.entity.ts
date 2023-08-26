import { Room } from 'src/domain/room/entity';
import { Thread } from 'src/domain/thread/entity';
import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Tag {
    @PrimaryColumn({ type: 'varchar2', length: 20 })
    name: string;

    @ManyToMany(() => Room, (room) => room.tags)
    rooms: Room[];

    @ManyToMany(() => Thread, (thread) => thread.tags)
    threads: Thread[];
}
