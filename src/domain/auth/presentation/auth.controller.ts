import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    OmitType,
} from '@nestjs/swagger';
import { LoginRequestDto, SignupRequestDto } from './dto/request';
import { AccessTokenResponseDto, SignupResponseDto } from './dto/response';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LogoutCommand, SignupCommand } from '../command';
import { LoginQuery, RefreshQuery } from '../query';
import { RefreshAuthGuard } from 'src/global/guards';
import { GetRefresh, GetUser } from 'src/global/decorators';
import { User } from 'src/domain/user/entity';
import { SetCookieInterceptor } from 'src/global/interceptors/cookie';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiOperation({
        summary: 'SignUp',
        description: 'Creates user and sends verification email',
    })
    @ApiCreatedResponse({ type: SignupRequestDto })
    @Post('signup')
    async signup(
        @Body() request: SignupRequestDto,
    ): Promise<SignupResponseDto> {
        return await this.commandBus.execute(
            new SignupCommand(
                request.email,
                request.nickname,
                request.password,
            ),
        );
    }

    @ApiOperation({
        summary: 'LogIn',
        description:
            'returns access token and expiration of matching user and sets refresh token to http only cookie',
    })
    @ApiOkResponse({ type: OmitType(AccessTokenResponseDto, ['cookies']) })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(SetCookieInterceptor)
    async login(
        @Body() request: LoginRequestDto,
    ): Promise<AccessTokenResponseDto> {
        return await this.queryBus.execute(
            new LoginQuery(request.email, request.password),
        );
    }

    @ApiOperation({
        summary: 'refresh',
        description: 'refreshes access token if refresh token is valid',
    })
    @ApiOkResponse({ type: OmitType(AccessTokenResponseDto, ['cookies']) })
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    @UseInterceptors(SetCookieInterceptor)
    async refresh(@GetUser() user: User): Promise<AccessTokenResponseDto> {
        return await this.queryBus.execute(new RefreshQuery(user));
    }

    @ApiOperation({
        summary: 'logout',
        description: 'blacklists the refresh token of the current user',
    })
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    @UseInterceptors(SetCookieInterceptor)
    async logout(@GetRefresh() token: string): Promise<void> {
        return await this.commandBus.execute(new LogoutCommand(token));
    }
}
