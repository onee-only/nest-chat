import { Room } from 'src/domain/room/entity';
import { Thread } from 'src/domain/thread/entity';
import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Tag {
    @PrimaryColumn()
    name: string;

    @ManyToMany(() => Room, (room) => room.tags, { lazy: true })
    rooms: Room[];

    @ManyToMany(() => Thread, (thread) => thread.tags, { lazy: true })
    threads: Thread[];
}
