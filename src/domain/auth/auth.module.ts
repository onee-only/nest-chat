import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './presentation/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailComfirmation } from './entity/email-confirmation.entity';
import { EmailComfirmationRepository } from './repository/email-confirmation.repository';
import { AuthSaga } from './saga';
import { CommandHandlers } from './command/handler';
import { PasswordManager } from './util';
import { SetCookieInterceptor } from 'src/global/interceptors/cookie';
import { QueryHandlers } from './query/handler';

@Module({
    imports: [
        UserModule,
        CqrsModule,
        TypeOrmModule.forFeature([EmailComfirmation]),
    ],
    controllers: [AuthController],
    providers: [
        // saga
        AuthSaga,

        // handlers
        ...CommandHandlers,
        ...QueryHandlers,

        // repositories
        EmailComfirmationRepository,

        // utils
        PasswordManager,

        // interceptors
        SetCookieInterceptor,
    ],
})
export class AuthModule {}
