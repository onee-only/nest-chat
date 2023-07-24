import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity';
import { NotificationRepository } from './repository';
import { RoomModule } from '../room/room.module';
import { CommandHandlers } from './command/handler';
import { NotifiactionPublisher } from './util/notification.publisher';

@Module({
    imports: [TypeOrmModule.forFeature([Notification]), RoomModule],
    providers: [
        // handlers
        ...CommandHandlers,

        // utils
        NotifiactionPublisher,

        // repositories
        NotificationRepository,
    ],
})
export class NotificationModule {}
