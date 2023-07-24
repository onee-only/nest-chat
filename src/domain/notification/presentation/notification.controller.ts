import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity';
import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import { ListNotificationQuery } from '../query';
import { ListNotificationResponseDto } from './dto/response';

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
}
