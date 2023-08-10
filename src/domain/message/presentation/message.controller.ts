import {
    Body,
    Controller,
    Get,
    MessageEvent,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Sse,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import {
    CreateMessageRequestDto,
    UpdateMessageRequestDto,
} from './dto/request';
import { CreateMessageCommand } from '../command';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ListMessageQuery, SubscribeMessageQuery } from '../query';
import { ParseDatePipe } from 'src/global/pipes';
import { ListMessageResponseDto } from './dto/response';
import { UpdateMessageCommand } from '../command/update-message.command';

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
    ): Promise<Observable<MessageEvent>> {
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

    @ApiOperation({
        summary: 'update message',
        description: 'Updates a message',
    })
    @Patch(':messageID')
    @UseGuards(JwtAuthGuard)
    async updateMesage(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @Param('messageID') messageID: string,
        @GetUser() user: User,
        @Body() request: UpdateMessageRequestDto,
    ): Promise<void> {
        const { body } = request;
        return await this.commandBus.execute(
            new UpdateMessageCommand(roomID, threadID, messageID, user, body),
        );
    }

    @ApiOperation({
        summary: 'list messages',
        description: 'Gives a list of messages',
    })
    @ApiOkResponse({
        type: ListMessageResponseDto,
    })
    @Get()
    async listMessage(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @GetUser() user: User,
        @Query('enddate', ParseDatePipe) endDate: Date,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<ListMessageResponseDto> {
        return await this.queryBus.execute(
            new ListMessageQuery(user, { roomID, threadID, endDate, limit }),
        );
    }
}
