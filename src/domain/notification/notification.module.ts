import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity';
import { NotificationRepository } from './repository';
import { RoomModule } from '../room/room.module';
import { CommandHandlers } from './command/handler';
import { NotifiactionPublisher } from './util/notification.publisher';
import { QueryHandlers } from './query/handler';
import { NotificationController } from './presentation/notification.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([Notification]), RoomModule],
    controllers: [NotificationController],
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
