import { Module } from '@nestjs/common';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import {
    ConfigModule,
    DatabaseModule,
    MailerModule,
    StrategyModule,
} from './global/modules';

@Module({
    imports: [
        // global modules
        ConfigModule,
        MailerModule,
        DatabaseModule,
        StrategyModule,

        // app modules
        AuthModule,
        UserModule,
    ],
})
export class AppModule {}
