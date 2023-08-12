import { MessageModule } from './domain/message/message.module';
import { Module } from '@nestjs/common';
import {
    ConfigModule,
    DatabaseModule,
    MailerModule,
    ObjectUtilModule,
    StorageModule,
} from './global/modules';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { RoomModule } from './domain/room/room.module';
import { TagModule } from './domain/tag/tag.module';
import { ThreadModule } from './domain/thread/thread.module';
import { NotificationModule } from './domain/notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        // common modules
        ConfigModule,
        MailerModule,
        DatabaseModule,
        StorageModule,
        ScheduleModule.forRoot(),

        // util
        ObjectUtilModule,

        // app modules
        AuthModule,
        UserModule,
        RoomModule,
        TagModule,
        ThreadModule,
        MessageModule,
        NotificationModule,
    ],
})
export class AppModule {}
