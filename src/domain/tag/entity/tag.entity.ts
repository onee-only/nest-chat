import { Room } from 'src/domain/room/entity';
import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Tag {
    @PrimaryColumn()
    name: string;

    @ManyToMany(() => Room, (room) => room.tags, { lazy: true })
    rooms: Room[];

    // should add thread
}
