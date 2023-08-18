import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    ApiConflictResponse,
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
    @ApiCreatedResponse()
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @ApiConflictResponse({ description: 'duplicate alias exists' })
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
        summary: 'list role',
        description: 'Gives a list of role',
    })
    @ApiOkResponse({ type: ListRoleResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
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
    @ApiOkResponse()
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @ApiConflictResponse({ description: 'duplicate alias exists' })
    @Patch(':alias')
    @UseGuards(JwtAuthGuard)
    async updateRole(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('alias') alias: string,
        @Body() request: UpdateRoleRequest,
        @GetUser() user: User,
    ): Promise<void> {
        const { name, permission } = request;
        return await this.commandBus.execute(
            new UpdateRoleCommand(user, roomID, alias, name, permission),
        );
    }

    @ApiOperation({
        summary: 'delete role',
        description: 'Deletes a role',
    })
    @ApiNoContentResponse()
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @ApiConflictResponse()
    @Delete(':alias')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async deleteRole(
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('alias') alias: string,
        @GetUser() user: User,
    ): Promise<void> {
        return await this.commandBus.execute(
            new DeleteRoleCommand(user, roomID, alias),
        );
    }
}
