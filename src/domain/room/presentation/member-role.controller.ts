import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import { CreateRoleRequest, UpdateRoleRequest } from './dto/request';
import {
    CreateRoleCommand,
    DeleteRoleCommand,
    UpdateRoleCommand,
} from '../command';
import { ListRoleQuery } from '../query';
import { ListRoleResponse } from './dto/response';

@ApiTags('member role')
@Controller('rooms/:roomID/roles')
export class MemberRoleController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    @ApiOperation({
        summary: 'create role',
        description: 'Creates a new role',
    })
    @Post()
    @UseGuards(JwtAuthGuard)
    async createRole(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Body() request: CreateRoleRequest,
        @GetUser() user: User,
    ): Promise<void> {
        const { name, permission } = request;
        return await this.commandBus.execute(
            new CreateRoleCommand(user, roomID, name, permission),
        );
    }

    @ApiOperation({
        summary: 'create role',
        description: 'Creates a new role',
    })
    @ApiOkResponse({ type: ListRoleResponse })
    @Get()
    @UseGuards(JwtAuthGuard)
    async listRole(
        @Param('roomID', ParseIntPipe) roomID: number,
        @GetUser() user: User,
    ): Promise<ListRoleResponse> {
        return await this.queryBus.execute(new ListRoleQuery(user, roomID));
    }

    @ApiOperation({
        summary: 'update role',
        description: 'Updates a role',
    })
    @Patch(':roleID')
    @UseGuards(JwtAuthGuard)
    async updateRole(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('roleID', ParseIntPipe) roleID: number,
        @Body() request: UpdateRoleRequest,
        @GetUser() user: User,
    ): Promise<void> {
        const { name, permission } = request;
        return await this.commandBus.execute(
            new UpdateRoleCommand(user, roomID, roleID, name, permission),
        );
    }

    @ApiOperation({
        summary: 'delete role',
        description: 'Deletes a role',
    })
    @Delete(':roleID')
    @UseGuards(JwtAuthGuard)
    async deleteRole(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('roleID', ParseIntPipe) roleID: number,
        @GetUser() user: User,
    ): Promise<void> {
        return await this.commandBus.execute(
            new DeleteRoleCommand(user, roomID, roleID),
        );
    }
}
