import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity';
import { NotificationRepository } from './repository';
import { RoomModule } from '../room/room.module';
import { CommandHandlers } from './command/handler';
import { NotifiactionPublisher } from './util/notification.publisher';
import { QueryHandlers } from './query/handler';

@Module({
    imports: [TypeOrmModule.forFeature([Notification]), RoomModule],
    providers: [
        // handlers
        ...CommandHandlers,
        ...QueryHandlers,

        // utils
        NotifiactionPublisher,

        // repositories
        NotificationRepository,
    ],
})
export class NotificationModule {}
