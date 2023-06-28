import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import { CreateRoleRequestDto } from './dto/request';
import { CreateRoleCommand } from '../command';

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
        @Body() request: CreateRoleRequestDto,
        @GetUser() user: User,
    ): Promise<void> {
        const { name, permission } = request;
        return await this.commandBus.execute(
            new CreateRoleCommand(user, roomID, name, permission),
        );
    }
}
