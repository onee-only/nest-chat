import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity';
import { NotificationRepository } from './repository';
import { RoomModule } from '../room/room.module';
import { CommandHandlers } from './command/handler';

@Module({
    imports: [TypeOrmModule.forFeature([Notification]), RoomModule],
    providers: [
        // handlers
        ...CommandHandlers,

        // repositories
        NotificationRepository,
    ],
})
export class NotificationModule {}
