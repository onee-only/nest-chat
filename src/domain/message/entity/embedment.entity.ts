import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Embedment {
    @PrimaryColumn({ type: 'varchar' })
    key: string;

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ type: 'varchar', length: 2048 })
    url: string;

    @Column({ type: 'uuid' })
    messageID: string;

    @ManyToOne(() => Message, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'messageID' })
    message: Message;
}
