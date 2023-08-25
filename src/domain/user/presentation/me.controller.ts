import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/global/decorators';
import { User } from '../entity';
import { JwtAuthGuard } from 'src/global/guards';
import {
    GetMiniProfileQuery,
    GetProfileQuery,
    ListMyRoomQuery,
} from '../query';
import {
    GetMeResponse,
    GetMyProfileResponse,
    ListMyRoomResponse,
} from './dto/response';
import { UpdateProfileRequest } from './dto/request';
import { UpdateProfileCommand } from '../command';

@ApiTags('users/me')
@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class MeController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiOperation({
        summary: 'get me',
        description: 'Provides minified information of the current user',
    })
    @ApiOkResponse({ type: GetMeResponse })
    @Get('mini')
    async getMe(@GetUser() user: User): Promise<GetMeResponse> {
        return await this.queryBus.execute(new GetMiniProfileQuery(user));
    }

    @ApiOperation({
        summary: 'get my profile',
        description: 'Provides profile information of the current user',
    })
    @ApiOkResponse({ type: GetMyProfileResponse })
    @Get()
    async getMyProfile(@GetUser() user: User): Promise<GetMyProfileResponse> {
        return await this.queryBus.execute(new GetProfileQuery(user));
    }

    @ApiOperation({
        summary: 'update current user',
        description: 'Updates profile information of the current user',
    })
    @ApiOkResponse({ type: GetMyProfileResponse })
    @Patch()
    async updateProfile(
        @GetUser() user: User,
        @Body() request: UpdateProfileRequest,
    ): Promise<GetMyProfileResponse> {
        return await this.commandBus.execute(
            new UpdateProfileCommand(user, { ...request }),
        );
    }

    @ApiOperation({
        summary: 'list my rooms',
        description:
            'Gives a list of the rooms that you are currently participating',
    })
    @ApiOkResponse({ type: ListMyRoomResponse })
    @Get('rooms')
    async listMyRoom(@GetUser() user: User): Promise<ListMyRoomResponse> {
        return await this.queryBus.execute(new ListMyRoomQuery(user));
    }
}
