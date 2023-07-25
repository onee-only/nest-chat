import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Embedment {
    @PrimaryColumn()
    key: string;

    @Column()
    name: string;

    @Column()
    url: string;

    @ManyToOne(() => Message, { cascade: true, onDelete: 'CASCADE' })
    message: Message;
}
