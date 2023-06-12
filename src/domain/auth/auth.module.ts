import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './presentation/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailComfirmation } from './entity/email-confirmation.entity';
import { EmailComfirmationRepository } from './repository/email-confirmation.repository';

@Module({
    imports: [
        UserModule,
        CqrsModule,
        TypeOrmModule.forFeature([EmailComfirmation]),
    ],
    controllers: [AuthController],
    providers: [EmailComfirmationRepository],
})
export class AuthModule {}
