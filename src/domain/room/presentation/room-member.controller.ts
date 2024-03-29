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
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/global/guards';
import { ListMemberResponse, RetreiveMemberResponse } from './dto/response';
import { GetUser } from 'src/global/decorators';
import { User } from 'src/domain/user/entity';
import { ListMemberQuery, RetreiveMemberQuery } from '../query';
import {
    JoinRoomCommand,
    KickMemberCommand,
    LeaveRoomCommand,
} from '../command';

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
    @ApiOkResponse({ type: ListMemberResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @Get()
    @UseGuards(JwtAuthGuard)
    async listMember(
        @Param('roomID', ParseIntPipe) roomID: number,
        @GetUser() user: User,
    ): Promise<ListMemberResponse> {
        return await this.queryBus.execute(new ListMemberQuery(user, roomID));
    }

    @ApiOperation({
        summary: 'join room',
        description: 'Join a room',
    })
    @ApiOkResponse()
    @ApiBadRequestResponse({ description: 'invitation is necessary' })
    @ApiForbiddenResponse({ description: 'invitation is invalid' })
    @ApiNotFoundResponse()
    @ApiConflictResponse({ description: 'you have already joined' })
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
        summary: 'leave room',
        description: 'Leaves a room',
    })
    @ApiOkResponse()
    @ApiForbiddenResponse({ description: 'you are the owner' })
    @ApiNotFoundResponse()
    @Delete()
    @UseGuards(JwtAuthGuard)
    async leaveRoom(
        @Param('roomID', ParseIntPipe) roomID: number,
        @GetUser() user: User,
    ): Promise<void> {
        return await this.commandBus.execute(
            new LeaveRoomCommand(roomID, user),
        );
    }

    @ApiOperation({
        summary: 'get member',
        description: 'Retreives the member',
    })
    @ApiOkResponse({ type: RetreiveMemberResponse })
    @ApiNotFoundResponse()
    @Get(':memberID')
    @UseGuards(JwtAuthGuard)
    async retreiveMember(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('memberID', ParseIntPipe) memberID: number,
        @GetUser() user: User,
    ): Promise<RetreiveMemberResponse> {
        return await this.queryBus.execute(
            new RetreiveMemberQuery(user, roomID, memberID),
        );
    }

    @ApiOperation({
        summary: 'kick member',
        description: 'Kicks the given member',
    })
    @ApiNoContentResponse()
    @ApiForbiddenResponse({
        description: 'you are kicking the owner or yourself or no permission',
    })
    @ApiNotFoundResponse()
    @HttpCode(HttpStatus.NO_CONTENT)
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
