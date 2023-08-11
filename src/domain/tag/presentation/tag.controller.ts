import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListTagQuery } from '../query';
import { ListRoomResponse } from 'src/domain/room/presentation/dto/response';

@ApiTags('tags')
@Controller('tags')
export class TagController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperation({
        summary: 'list tags',
        description: 'Gives a list of tags',
    })
    @ApiOkResponse({ type: ListRoomResponse })
    @Get()
    async listTag(
        @Query('keyword') keyword: string,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<ListRoomResponse> {
        return await this.queryBus.execute(new ListTagQuery(keyword, limit));
    }
}
