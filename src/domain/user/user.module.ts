import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/user.controller';
import { Module } from '@nestjs/common';
import { Avatar, User } from './entity';
import { UserRepository } from './repository/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([User, Avatar])],
    controllers: [UserController],
    providers: [UserRepository],
    exports: [UserRepository],
})
export class UserModule {}
