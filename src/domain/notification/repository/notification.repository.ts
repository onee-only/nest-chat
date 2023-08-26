import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Notification } from '../entity';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
    constructor(private readonly dataSource: DataSource) {
        super(Notification, dataSource.createEntityManager());
    }
}
