import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/global/guards';
import { ListMemberResponseDto } from './dto/response';
import { GetUser } from 'src/global/decorators';
import { User } from 'src/domain/user/entity';
import { ListMemberQuery } from '../query';
import { JoinRoomCommand, KickMemberCommand } from '../command';

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
        @Param('roomID', ParseIntPipe) roomID: number,
        @GetUser() user: User,
    ): Promise<ListMemberResponseDto> {
        return await this.queryBus.execute(new ListMemberQuery(user, roomID));
    }

    @ApiOperation({
        summary: 'join room',
        description: 'Join a room',
    })
    @HttpCode(HttpStatus.OK)
    @Post()
    @UseGuards(JwtAuthGuard)
    async joinRoom(
        @Param('roomID', ParseIntPipe) roomID: number,
        @GetUser() user: User,
        @Query('token') token?: string,
    ): Promise<void> {
        return await this.commandBus.execute(
            new JoinRoomCommand(roomID, user, token),
        );
    }

    @ApiOperation({
        summary: 'kick member',
        description: 'Kicks the given member',
    })
    @Delete(':memberID')
    @UseGuards(JwtAuthGuard)
    async kickMember(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('memberID', ParseIntPipe) memberID: number,
        @GetUser() user: User,
    ): Promise<void> {
        return await this.commandBus.execute(
            new KickMemberCommand(roomID, memberID, user),
        );
    }
}
