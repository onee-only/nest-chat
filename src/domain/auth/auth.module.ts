import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './presentation/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmation } from './entity/email-confirmation.entity';
import { EmailConfirmationRepository } from './repository/email-confirmation.repository';
import { AuthSaga } from './saga';
import { CommandHandlers } from './command/handler';
import { JwtProvider, PasswordManager } from './util';
import { QueryHandlers } from './query/handler';
import { CacheModule } from 'src/global/modules';

@Module({
    imports: [
        UserModule,
        CqrsModule,
        CacheModule,
        TypeOrmModule.forFeature([EmailConfirmation]),
    ],
    controllers: [AuthController],
    providers: [
        // saga
        AuthSaga,

        // handlers
        ...CommandHandlers,
        ...QueryHandlers,

        // repositories
        EmailConfirmationRepository,

        // utils
        PasswordManager,
        JwtProvider,
    ],
})
export class AuthModule {}
