import { DataSource, Repository } from 'typeorm';
import { Message } from '../entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageRepository extends Repository<Message> {
    constructor(private readonly dataSource: DataSource) {
        super(Message, dataSource.createEntityManager());
    }
}
