import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/user.controller';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Avatar, User } from './entity';
import { AvatarRepository, UserRepository } from './repository';
import { CommandHandlers } from './command/handler';
import { QueryHandlers } from './query/handler';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([User, Avatar])],
    controllers: [UserController],
    providers: [
        // handlers
        ...CommandHandlers,
        ...QueryHandlers,

        // repositories
        UserRepository,
        AvatarRepository,
    ],
    exports: [UserRepository, AvatarRepository],
})
export class UserModule {}
