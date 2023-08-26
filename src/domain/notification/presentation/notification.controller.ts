import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    MessageEvent,
    Param,
    ParseUUIDPipe,
    Req,
    Sse,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import { ListNotificationQuery, SubscribeNotificationQuery } from '../query';
import { ListNotificationResponse } from './dto/response';
import {
    ClearNotificationsCommand,
    DeleteNotificationCommand,
} from '../command';
import { Observable } from 'rxjs';
import { Request } from 'express';

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
    @ApiOkResponse({ type: ListNotificationResponse })
    @Get('')
    async listNotification(
        @GetUser() user: User,
    ): Promise<ListNotificationResponse> {
        return await this.queryBus.execute(new ListNotificationQuery(user));
    }

    @ApiOperation({
        summary: 'delete notifications',
        description: 'Deletes all the notifications of requested user',
    })
    @ApiNoContentResponse()
    @HttpCode(HttpStatus.NO_CONTENT)
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
    @ApiNoContentResponse()
    @ApiNotFoundResponse()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':uuid')
    async deleteNotification(
        @GetUser() user: User,
        @Param('uuid', ParseUUIDPipe) uuid: string,
    ): Promise<void> {
        return await this.commandBus.execute(
            new DeleteNotificationCommand(uuid, user),
        );
    }

    @Sse('events')
    async subscribeNotification(
        @Req() req: Request,
        @GetUser() user: User,
    ): Promise<Observable<MessageEvent>> {
        return await this.queryBus.execute(
            new SubscribeNotificationQuery(user, req),
        );
    }
}
