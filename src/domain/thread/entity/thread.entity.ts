import { Room } from 'src/domain/room/entity';
import { Tag } from 'src/domain/tag/entity/tag.entity';
import { User } from 'src/domain/user/entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Thread {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @ManyToOne(() => User, {
        eager: true,
        nullable: true,
        onDelete: 'SET NULL',
    })
    creator: User;

    @ManyToOne(() => Room, { lazy: true })
    room: Room;

    @Column()
    title: string;

    @CreateDateColumn()
    createdAt: string;

    @ManyToMany(() => Tag, { lazy: true })
    tags: Tag[];
}
