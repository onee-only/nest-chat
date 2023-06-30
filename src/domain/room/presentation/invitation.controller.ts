import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import { CreateInvitationCommand } from '../command';
import { CreateInvitationRequestDto } from './dto/request';
import { CreateInvitationResponseDto } from './dto/response';

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
}
