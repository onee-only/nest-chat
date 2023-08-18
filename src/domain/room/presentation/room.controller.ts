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
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { CreateRoomRequest, UpdateRoomRequest } from './dto/request';
import {
    CreateRoomResponse,
    ListRoomResponse,
    RetreiveRoomResponse,
} from './dto/response';
import { JwtAuthGuard } from 'src/global/guards';
import {
    CreateRoomCommand,
    DeleteRoomCommand,
    UpdateRoomCommand,
} from '../command';
import { RoomOrder, RoomOrderDir } from '../enum';
import { ListRoomQuery, RetreiveRoomQuery } from '../query';
import { ParseDatePipe, ParseOptionalIntPipe } from 'src/global/pipes';

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
    @ApiCreatedResponse({ type: CreateRoomResponse })
    @Post()
    @UseGuards(JwtAuthGuard)
    async createRoom(
        @GetUser() user: User,
        @Body() request: CreateRoomRequest,
    ): Promise<CreateRoomResponse> {
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
    @ApiOkResponse({ type: ListRoomResponse })
    @Get()
    @UseGuards(JwtAuthGuard)
    async listRoom(
        @GetUser() user: User,
        @Query('page', ParseIntPipe) page: number,
        @Query('order', new ParseEnumPipe(RoomOrder)) order: RoomOrder,
        @Query('dir', new ParseEnumPipe(RoomOrderDir)) dir: RoomOrderDir,

        @Query('query') query?: string,
        @Query('size', ParseOptionalIntPipe) size?: number,
        @Query('startdate', new ParseDatePipe({ isRequired: false }))
        startDate?: Date,
        @Query('enddate', new ParseDatePipe({ isRequired: false }))
        endDate?: Date,
        @Query('tags', new ParseArrayPipe({ optional: true })) tags?: string[],
    ): Promise<ListRoomResponse> {
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
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiNotFoundResponse({ description: 'room not found or role not found' })
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateRoom(
        @Param('id', ParseIntPipe) roomID: number,
        @GetUser() user: User,
        @Body() request: UpdateRoomRequest,
    ): Promise<void> {
        return await this.commandBus.execute(
            new UpdateRoomCommand(user, roomID, { ...request }),
        );
    }

    @ApiOperation({
        summary: 'delete a room',
        description: 'Deletes a room',
    })
    @ApiNoContentResponse()
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
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
    @ApiOkResponse({ type: RetreiveRoomResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async retreiveRoom(
        @Param('id', ParseIntPipe) roomID: number,
        @GetUser() user: User,
    ): Promise<RetreiveRoomResponse> {
        return await this.queryBus.execute(new RetreiveRoomQuery(user, roomID));
    }
}
