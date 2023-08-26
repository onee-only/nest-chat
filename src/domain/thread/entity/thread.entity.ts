import { Room } from 'src/domain/room/entity';
import { Tag } from 'src/domain/tag/entity/tag.entity';
import { User } from 'src/domain/user/entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Thread {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ type: 'bigint', unsigned: true, nullable: true })
    creatorID: number;

    @ManyToOne(() => User, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'creatorID' })
    creator: User;

    @Column({ type: 'bigint', unsigned: true })
    roomID: number;

    @ManyToOne(() => Room, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roomID' })
    room: Room;

    @Column({ type: 'varchar', length: 80 })
    title: string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: string;

    @ManyToMany(() => Tag)
    @JoinTable({ name: 'thread_tags' })
    tags: Tag[];
}
