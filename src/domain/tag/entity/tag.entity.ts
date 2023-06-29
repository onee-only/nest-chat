import { Room } from 'src/domain/room/entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Room, (room) => room.tags, { lazy: true })
    rooms: Room[];

    // should add thread
}
