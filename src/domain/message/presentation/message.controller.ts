import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Post,
    Sse,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import { CreateMessageRequestDto } from './dto/request/create-message.request.dto';
import { CreateMessageCommand } from '../command';

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
    subscribeMessage(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @GetUser() user: User,
    ): Observable<any> {
        // TODO: subscribe message event
        return new Observable();
    }

    @ApiOperation({
        summary: 'create message',
        description: 'Creates a message',
    })
    @Post()
    @UseGuards(JwtAuthGuard)
    async createMessage(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @GetUser() user: User,
        @Body() request: CreateMessageRequestDto,
    ): Promise<void> {
        const { body } = request;
        return await this.commandBus.execute(
            new CreateMessageCommand(roomID, threadID, user, body),
        );
    }
}
