import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread, PinnedThread } from './entity';
import { CqrsModule } from '@nestjs/cqrs';
import { RoomModule } from '../room/room.module';
import { ThreadController } from './presentation/thread.controller';
import { PinnedThreadRepository, ThreadRepository } from './repository';
import { QueryHandlers } from './query/handler';
import { CommandHandlers } from './command/handler';
import { TagModule } from '../tag/tag.module';
import { ChatGateway } from './presentation/chat.gateway';
import { ChatBroker, ChatInfoManager, ChatRepository } from './util/chat';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Thread, PinnedThread]),
        TagModule,
        RoomModule,
        UserModule,
    ],
    controllers: [ThreadController],
    providers: [
        // gateways
        ChatGateway,

        // handlers
        ...CommandHandlers,
        ...QueryHandlers,

        // utils
        ChatBroker,
        ChatInfoManager,
        Logger,

        // repositories
        ThreadRepository,
        PinnedThreadRepository,
        ChatRepository,
    ],
    exports: [ThreadRepository, ChatBroker, ChatInfoManager],
})
export class ThreadModule {}
