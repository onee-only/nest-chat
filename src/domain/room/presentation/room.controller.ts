import {
    Body,
    Controller,
    Delete,
    Get,
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
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { CreateRoomRequestDto, UpdateRoomRequestDto } from './dto/request';
import {
    CreateRoomResponseDto,
    ListRoomResponseDto,
    RetreiveRoomResponseDto,
} from './dto/response';
import { JwtAuthGuard } from 'src/global/guards';
import {
    CreateRoomCommand,
    DeleteRoomCommand,
    UpdateRoomCommand,
} from '../command';
import { RoomOrder, RoomOrderDir } from '../enum';
import { ListRoomQuery, RetreiveRoomQuery } from '../query';
import { ParseDatePipe } from 'src/global/pipes';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiOperation({
        summary: 'create a room',
        description: 'Creates a room',
    })
    @ApiCreatedResponse({ type: CreateRoomResponseDto })
    @Post()
    @UseGuards(JwtAuthGuard)
    async createRoom(
        @GetUser() user: User,
        @Body() request: CreateRoomRequestDto,
    ): Promise<CreateRoomResponseDto> {
        const {
            profileURL,
            name,
            description,
            isPublic,
            defaultRole: { name: roleName, permission: rolePermission },
        } = request;

        return await this.commandBus.execute(
            new CreateRoomCommand(
                { roleName, rolePermission },
                {
                    name,
                    isPublic,
                    profileURL,
                    description,
                    owner: user,
                },
            ),
        );
    }

    @ApiOperation({
        summary: 'list room',
        description: 'gives a List of rooms',
    })
    @ApiOkResponse({ type: ListRoomResponseDto })
    @Get()
    async listRoom(
        @GetUser() user: User,
        @Query('page', ParseIntPipe) page: number,
        @Query('order', new ParseEnumPipe(RoomOrder)) order: RoomOrder,
        @Query('dir', new ParseEnumPipe(RoomOrderDir)) dir: RoomOrderDir,
        @Query('query') query?: string,
        @Query('size', ParseIntPipe) size?: number,
        @Query('startdate', ParseDatePipe) startDate?: Date,
        @Query('enddate', ParseDatePipe) endDate?: Date,
        @Query('tags', new ParseArrayPipe()) tags?: string[],
    ): Promise<ListRoomResponseDto> {
        return await this.queryBus.execute(
            new ListRoomQuery(user, {
                page,
                size,
                order,
                query,
                endDate,
                startDate,
                tags,
                orderDir: dir,
            }),
        );
    }

    @ApiOperation({
        summary: 'update a room',
        description: 'Updates a room',
    })
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateRoom(
        @Param('id', ParseIntPipe) roomID: number,
        @GetUser() user: User,
        @Body() request: UpdateRoomRequestDto,
    ): Promise<void> {
        return await this.commandBus.execute(
            new UpdateRoomCommand(user, roomID, { ...request }),
        );
    }

    @ApiOperation({
        summary: 'delete a room',
        description: 'Deletes a room',
    })
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteRoom(
        @Param('id', ParseIntPipe) roomID: number,
        @GetUser() user: User,
    ): Promise<void> {
        return await this.commandBus.execute(
            new DeleteRoomCommand(user, roomID),
        );
    }

    @ApiOperation({
        summary: 'retreive a room',
        description: 'Finds a room',
    })
    @ApiOkResponse({ type: RetreiveRoomResponseDto })
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async retreiveRoom(
        @Param('id', ParseIntPipe) roomID: number,
        @GetUser() user: User,
    ): Promise<RetreiveRoomResponseDto> {
        return await this.queryBus.execute(new RetreiveRoomQuery(user, roomID));
    }
}
