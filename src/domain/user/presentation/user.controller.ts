import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/global/decorators';
import { User } from '../entity';
import { JwtAuthGuard } from 'src/global/guards';
import { GetMiniProfileQuery } from '../query';
import { GetMeResponseDto } from './dto/response';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiOperation({
        summary: 'get me',
        description: 'Provides information of the current user',
    })
    @ApiOkResponse({ type: GetMeResponseDto })
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@GetUser() user: User): Promise<GetMeResponseDto> {
        return await this.queryBus.execute(new GetMiniProfileQuery(user));
    }
}
