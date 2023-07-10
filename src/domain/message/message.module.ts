import { MessageController } from './presentation/message.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Embedment, Message } from './entity';
import { EmbedmentRepository, MessageRepository } from './repository';
import { CqrsModule } from '@nestjs/cqrs';
import { RoomModule } from '../room/room.module';
import { ThreadModule } from '../thread/thread.module';
import { MessageParser } from './util';
import { CommandHandlers } from './command/handler';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Message, Embedment]),
        RoomModule,
        ThreadModule,
    ],
    controllers: [MessageController],
    providers: [
        // handlers
        ...CommandHandlers,

        // utils
        MessageParser,

        // repositories
        MessageRepository,
        EmbedmentRepository,
    ],
})
export class MessageModule {}
