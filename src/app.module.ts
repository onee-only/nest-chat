import { Module } from '@nestjs/common';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import {
    CaacheModule,
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
        CaacheModule,

        // app modules
        AuthModule,
        UserModule,
    ],
})
export class AppModule {}
