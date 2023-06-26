import { Module } from '@nestjs/common';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { ConfigModule, DatabaseModule, MailerModule } from './global/modules';

@Module({
    imports: [
        // common modules
        ConfigModule,
        MailerModule,
        DatabaseModule,

        // app modules
        AuthModule,
        UserModule,
    ],
})
export class AppModule {}
