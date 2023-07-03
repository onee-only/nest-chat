import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread, PinnedThread } from './entity';
import { CqrsModule } from '@nestjs/cqrs';
import { RoomModule } from '../room/room.module';
import { ThreadController } from './presentation/thread.controller';
import { PinnedThreadRepository, ThreadRepository } from './repository';
import { QueryHandlers } from './query/handler';
import { CommandHandlers } from './command/handler';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Thread, PinnedThread]),
        RoomModule,
    ],
    controllers: [ThreadController],
    providers: [
        // handlers
        ...CommandHandlers,
        ...QueryHandlers,

        // repositories
        ThreadRepository,
        PinnedThreadRepository,
    ],
})
export class ThreadModule {}
