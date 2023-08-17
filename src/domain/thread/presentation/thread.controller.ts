import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseArrayPipe,
    ParseEnumPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { ThreadOrder, ThreadOrderDir } from '../enum';
import { ParseDatePipe } from 'src/global/pipes';
import {
    ListPinnedThreadQuery,
    ListThreadQuery,
    RetreiveSessionQuery,
} from '../query';
import {
    CreateThreadResponse,
    ListThreadReponseDto,
    RetreiveSessionResponse,
} from './dto/response';
import {
    CreateThreadCommand,
    DeleteThreadCommand,
    TogglePinCommand,
    UpdateThreadCommand,
} from '../command';
import { CreateThreadRequest, UpdateThreadRequest } from './dto/request';
import { JwtAuthGuard } from 'src/global/guards';

@ApiTags('threads')
@Controller('rooms/:roomID/threads')
export class ThreadController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiOperation({
        summary: 'create thread',
        description: 'Creates a new thread',
    })
    @Post()
    @UseGuards(JwtAuthGuard)
    async createThread(
        @Param('roomID', ParseIntPipe) roomID: number,
        @GetUser() user: User,
        @Body() request: CreateThreadRequest,
    ): Promise<CreateThreadResponse> {
        const { title } = request;
        return await this.commandBus.execute(
            new CreateThreadCommand(user, roomID, title),
        );
    }

    @ApiOperation({
        summary: 'list threads',
        description: 'Gives a list of the threads',
    })
    @ApiOkResponse({ type: ListThreadReponseDto })
    @Get()
    @UseGuards(JwtAuthGuard)
    async listThread(
        @Param('roomID', ParseIntPipe) roomID: number,
        @GetUser() user: User,
        @Query('page', ParseIntPipe) page: number,
        @Query('order', new ParseEnumPipe(ThreadOrder)) order: ThreadOrder,
        @Query('dir', new ParseEnumPipe(ThreadOrderDir)) dir: ThreadOrderDir,

        @Query('query') query?: string,
        @Query('size', ParseIntPipe) size?: number,
        @Query('startdate', new ParseDatePipe({ isRequired: false }))
        startDate?: Date,
        @Query('enddate', new ParseDatePipe({ isRequired: false }))
        endDate?: Date,
        @Query('tags', new ParseArrayPipe()) tags?: string[],
    ): Promise<ListThreadReponseDto> {
        return await this.queryBus.execute(
            new ListThreadQuery(user, {
                roomID,
                order,
                page,
                endDate,
                query,
                size,
                startDate,
                tags,
                orderDir: dir,
            }),
        );
    }

    @ApiOperation({
        summary: 'list pinned threads',
        description: 'Gives a list of the pinned threads',
    })
    @ApiOkResponse({ type: ListThreadReponseDto })
    @Get('pinned')
    @UseGuards(JwtAuthGuard)
    async listPinnedThread(
        @Param('roomID', ParseIntPipe) roomID: number,
        @GetUser() user: User,
    ): Promise<ListThreadReponseDto> {
        return await this.queryBus.execute(
            new ListPinnedThreadQuery(roomID, user),
        );
    }

    @ApiOperation({
        summary: 'delete thread',
        description: 'Deletes a thread',
    })
    @Delete(':threadID')
    @UseGuards(JwtAuthGuard)
    async deleteThread(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @GetUser() user: User,
    ): Promise<void> {
        return await this.commandBus.execute(
            new DeleteThreadCommand(roomID, threadID, user),
        );
    }

    @ApiOperation({
        summary: 'update thread',
        description: 'Updates a thread',
    })
    @Patch(':threadID')
    @UseGuards(JwtAuthGuard)
    async updateThread(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @Body() request: UpdateThreadRequest,
        @GetUser() user: User,
    ): Promise<void> {
        return await this.commandBus.execute(
            new UpdateThreadCommand(roomID, threadID, user, { ...request }),
        );
    }

    @ApiOperation({
        summary: 'get session info',
        description: 'Updates a thread',
    })
    @ApiOkResponse({ type: RetreiveSessionResponse })
    @Get(':threadID/session')
    @UseGuards(JwtAuthGuard)
    async retreiveSession(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @GetUser() user: User,
    ): Promise<RetreiveSessionResponse> {
        return await this.queryBus.execute(
            new RetreiveSessionQuery(roomID, threadID, user),
        );
    }

    @ApiOperation({
        summary: 'toggle pin thread',
        description: 'Toggles a pin of a thread. if pinned, unpin',
    })
    @HttpCode(HttpStatus.OK)
    @Post(':threadID/pin')
    @UseGuards(JwtAuthGuard)
    async togglepinThread(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('threadID', ParseIntPipe) threadID: number,
        @Body() request: UpdateThreadRequest,
        @GetUser() user: User,
    ): Promise<void> {
        return await this.commandBus.execute(
            new TogglePinCommand(roomID, threadID, user),
        );
    }
}
