import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/global/decorators';
import { User } from '../entity';
import { JwtAuthGuard } from 'src/global/guards';
import { GetMiniProfileQuery, GetProfileQuery } from '../query';
import { GetMeResponseDto, GetMyProfileResponseDto } from './dto/response';
import { UpdateProfileRequestDto } from './dto/request';
import { UpdateProfileCommand } from '../command';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiOperation({
        summary: 'get me',
        description: 'Provides minified information of the current user',
    })
    @ApiOkResponse({ type: GetMeResponseDto })
    @Get('me')
    async getMe(@GetUser() user: User): Promise<GetMeResponseDto> {
        return await this.queryBus.execute(new GetMiniProfileQuery(user));
    }

    @ApiOperation({
        summary: 'get my profile',
        description: 'Provides profile information of the current user',
    })
    @ApiOkResponse({ type: GetMyProfileResponseDto })
    @Get('me/profile')
    async getMyProfile(
        @GetUser() user: User,
    ): Promise<GetMyProfileResponseDto> {
        return await this.queryBus.execute(new GetProfileQuery(user));
    }

    @ApiOperation({
        summary: 'update current user',
        description: 'Updates profile information of the current user',
    })
    @ApiOkResponse({ type: GetMyProfileResponseDto })
    @Patch('me/profile')
    async updateProfile(
        @GetUser() user: User,
        @Body() request: UpdateProfileRequestDto,
    ): Promise<GetMyProfileResponseDto> {
        return await this.commandBus.execute(
            new UpdateProfileCommand(user, { ...request }),
        );
    }
}
