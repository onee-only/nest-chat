import { Module } from '@nestjs/common';
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
import { ChatManager } from './util';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Thread, PinnedThread]),
        TagModule,
        RoomModule,
    ],
    controllers: [ThreadController],
    providers: [
        // gateways
        ChatGateway,

        // handlers
        ...CommandHandlers,
        ...QueryHandlers,

        // utils
        ChatManager,

        // repositories
        ThreadRepository,
        PinnedThreadRepository,
    ],
    exports: [ThreadRepository],
})
export class ThreadModule {}
