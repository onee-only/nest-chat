import {
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import { ListNotificationQuery } from '../query';
import { ListNotificationResponseDto } from './dto/response';
import {
    ClearNotificationsCommand,
    DeleteNotificationCommand,
} from '../command';

@ApiTags('notifications')
@Controller('users/me/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    @ApiOperation({
        summary: 'list notifications',
        description: 'Gives a list of notifications of requested user',
    })
    @ApiOkResponse({ type: ListNotificationResponseDto })
    @Get('')
    async listNotification(
        @GetUser() user: User,
    ): Promise<ListNotificationResponseDto> {
        return await this.queryBus.execute(new ListNotificationQuery(user));
    }

    @ApiOperation({
        summary: 'delete notifications',
        description: 'Deletes all the notifications of requested user',
    })
    @Delete('')
    async clearNotification(@GetUser() user: User): Promise<void> {
        return await this.commandBus.execute(
            new ClearNotificationsCommand(user),
        );
    }

    @ApiOperation({
        summary: 'delete notification',
        description: 'Deletes the given notification of requested user',
    })
    @Delete(':uuid')
    async deleteNotification(
        @GetUser() user: User,
        @Param('uuid', ParseUUIDPipe) uuid: string,
    ): Promise<void> {
        return await this.commandBus.execute(
            new DeleteNotificationCommand(uuid, user),
        );
    }
}
