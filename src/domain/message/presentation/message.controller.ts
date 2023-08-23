import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
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
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import { CreateMessageRequest, UpdateMessageRequest } from './dto/request';
import { CreateMessageCommand, DeleteMessageCommand } from '../command';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ListMessageQuery, SubscribeMessageQuery } from '../query';
import { ParseDatePipe } from 'src/global/pipes';
import { ListMessageResponse } from './dto/response';
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
    @ApiCreatedResponse()
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('embedments'))
    async createMessage(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @GetUser() user: User,
        @UploadedFiles() embedments: Array<Express.Multer.File>,
        @Body() request: CreateMessageRequest,
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
        summary: 'list messages',
        description: 'Gives a list of messages',
    })
    @ApiOkResponse({ type: ListMessageResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @Get()
    @UseGuards(JwtAuthGuard)
    async listMessage(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @GetUser() user: User,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('enddate', new ParseDatePipe({ isRequired: true }))
        endDate: Date,
    ): Promise<ListMessageResponse> {
        return await this.queryBus.execute(
            new ListMessageQuery(user, { roomID, threadID, endDate, limit }),
        );
    }

    @ApiOperation({
        summary: 'update message',
        description: 'Updates a message',
    })
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @Patch(':messageID')
    @UseGuards(JwtAuthGuard)
    async updateMesage(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @Param('messageID') messageID: string,
        @GetUser() user: User,
        @Body() request: UpdateMessageRequest,
    ): Promise<void> {
        const { body } = request;
        return await this.commandBus.execute(
            new UpdateMessageCommand(roomID, threadID, messageID, user, body),
        );
    }

    @ApiOperation({
        summary: 'delete message',
        description: 'Deletes a message',
    })
    @ApiNoContentResponse()
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':messageID')
    @UseGuards(JwtAuthGuard)
    async deleteMessage(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @Param('messageID') messageID: string,
        @GetUser() user: User,
    ): Promise<void> {
        return await this.commandBus.execute(
            new DeleteMessageCommand(roomID, threadID, messageID, user),
        );
    }
}
