import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Embedment {
    @PrimaryColumn({ type: 'uuid', generated: true })
    id: string;

    @ManyToOne(() => Message, { cascade: true, onDelete: 'CASCADE' })
    message: Message;

    @Column()
    url: string;
}
