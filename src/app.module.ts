import { Module } from '@nestjs/common';
import { ConfigModule, DatabaseModule, MailerModule } from './global/modules';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { RoomModule } from './domain/room/room.module';
import { TagModule } from './domain/tag/tag.module';
import { ThreadModule } from './domain/thread/thread.module';

@Module({
    imports: [
        // common modules
        ConfigModule,
        MailerModule,
        DatabaseModule,

        // app modules
        AuthModule,
        UserModule,
        RoomModule,
        TagModule,
        ThreadModule,
    ],
})
export class AppModule {}
