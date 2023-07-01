import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
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
import { JwtAuthGuard } from 'src/global/guards';
import { CreateInvitationCommand, DeleteInvitationCommand } from '../command';
import { CreateInvitationRequestDto } from './dto/request';
import {
    CreateInvitationResponseDto,
    ListInvitationResponseDto,
} from './dto/response';
import { ListInvitationQuery } from '../query';

@ApiTags('room invitations')
@Controller('rooms/:roomID/invitations')
export class InvitationController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    @ApiOperation({
        summary: 'create invitation',
        description: 'Creates an invitation',
    })
    @ApiCreatedResponse({ type: CreateInvitationResponseDto })
    @Post()
    @UseGuards(JwtAuthGuard)
    async createInvitation(
        @GetUser() user: User,
        @Param('roomID', ParseIntPipe) roomID: number,
        @Body() request: CreateInvitationRequestDto,
    ): Promise<CreateInvitationResponseDto> {
        const { duration, roleID } = request;
        return await this.commandBus.execute(
            new CreateInvitationCommand(roomID, roleID, duration, user),
        );
    }

    @ApiOperation({
        summary: 'list invitation',
        description: 'Gives a list of invitations',
    })
    @ApiOkResponse({ type: ListInvitationResponseDto })
    @Get()
    @UseGuards(JwtAuthGuard)
    async listInvitation(
        @GetUser() user: User,
        @Param('roomID', ParseIntPipe) roomID: number,
    ): Promise<ListInvitationResponseDto> {
        return await this.queryBus.execute(
            new ListInvitationQuery(roomID, user),
        );
    }

    @ApiOperation({
        summary: 'delete invitation',
        description: 'Deletes an invitation',
    })
    @Delete(':token')
    @UseGuards(JwtAuthGuard)
    async deleteInvitation(
        @GetUser() user: User,
        @Param('roomID', ParseIntPipe) roomID: number,
        @Param('token', ParseIntPipe) token: string,
    ): Promise<void> {
        return await this.commandBus.execute(
            new DeleteInvitationCommand(roomID, token, user),
        );
    }
}
