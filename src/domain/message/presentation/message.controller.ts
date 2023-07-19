import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Post,
    Sse,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import { CreateMessageRequestDto } from './dto/request/create-message.request.dto';
import { CreateMessageCommand } from '../command';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MessagePayload } from 'src/domain/thread/util/chat/types';
import { SubscribeMessageQuery } from '../query';

@ApiTags('messages')
@Controller('rooms/:roomID/threads/:threadID/messages')
export class MessageController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    @ApiOperation({
        summary: 'subscribe message',
        description: 'SSE. Gets any meesage published from this thread',
    })
    @Sse('events')
    @UseGuards(JwtAuthGuard)
    async subscribeMessage(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @GetUser() user: User,
    ): Promise<Observable<MessagePayload>> {
        return await this.queryBus.execute(
            new SubscribeMessageQuery(roomID, threadID, user),
        );
    }

    @ApiOperation({
        summary: 'create message',
        description: 'Creates a message',
    })
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('embedments'))
    async createMessage(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @GetUser() user: User,
        @UploadedFiles() embedments: Array<Express.Multer.File>,
        @Body() request: CreateMessageRequestDto,
    ): Promise<void> {
        const { body, replyTo } = request;
        return await this.commandBus.execute(
            new CreateMessageCommand(roomID, threadID, user, {
                body,
                replyTo,
                embedments,
            }),
        );
    }
}
