import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/user.controller';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Avatar, User } from './entity';
import { UserRepository } from './repository/user.repository';
import { AvatarRepository } from './repository';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([User, Avatar])],
    controllers: [UserController],
    providers: [UserRepository, AvatarRepository],
    exports: [UserRepository, AvatarRepository],
})
export class UserModule {}
