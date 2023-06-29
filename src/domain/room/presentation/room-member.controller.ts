import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/global/guards';
import { ListMemberResponseDto } from './dto/response';
import { GetUser } from 'src/global/decorators';
import { User } from 'src/domain/user/entity';
import { ListMemberQuery } from '../query';

@ApiTags('room members')
@Controller('rooms/:roomID/members')
export class RoomMemberController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    @ApiOperation({
        summary: 'list members',
        description: 'Gives a list of room members',
    })
    @ApiOkResponse({ type: ListMemberResponseDto })
    @Get()
    @UseGuards(JwtAuthGuard)
    async listMember(
        @GetUser() user: User,
        @Param('roomID', ParseIntPipe) roomID: number,
    ): Promise<ListMemberResponseDto> {
        return await this.queryBus.execute(new ListMemberQuery(user, roomID));
    }
}
