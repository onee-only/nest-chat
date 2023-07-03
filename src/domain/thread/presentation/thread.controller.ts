import {
    Body,
    Controller,
    Get,
    Param,
    ParseArrayPipe,
    ParseEnumPipe,
    ParseIntPipe,
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
import { ListThreadQuery } from '../query';
import { CreateThreadResponseDto, ListThreadReponseDto } from './dto/response';
import { CreateThreadCommand } from '../command';
import { CreateThreadRequestDto } from './dto/request';
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
        @Body() request: CreateThreadRequestDto,
    ): Promise<CreateThreadResponseDto> {
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
        @Query('startdate', ParseDatePipe) startDate?: Date,
        @Query('enddate', ParseDatePipe) endDate?: Date,
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
}