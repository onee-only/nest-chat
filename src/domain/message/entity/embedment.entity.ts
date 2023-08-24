import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Embedment {
    @PrimaryColumn()
    key: string;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column({ type: 'uuid' })
    messageID: string;

    @ManyToOne(() => Message, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'messageID' })
    message: Message;
}
