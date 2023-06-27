import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { CreateRoomRequestDto } from './dto/request';
import { CreateRoomResponseDto } from './dto/response';
import { JwtAuthGuard } from 'src/global/guards';
import { CreateRoomCommand } from '../command';

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
                user,
                { roleName, rolePermission },
                {
                    name,
                    isPublic,
                    profileURL,
                    description,
                },
            ),
        );
    }
}
