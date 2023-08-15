import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
    OmitType,
} from '@nestjs/swagger';
import { LoginRequest, SignupRequest } from './dto/request';
import { AccessTokenResponse, SignupResponse } from './dto/response';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LogoutCommand, SignupCommand, VerifyEmailCommand } from '../command';
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
        summary: 'Sign Up',
        description: 'Creates user and sends verification email',
    })
    @ApiCreatedResponse({ type: SignupResponse })
    @ApiConflictResponse({ description: 'duplicate email or nickname' })
    @Post('signup')
    async signup(@Body() request: SignupRequest): Promise<SignupResponse> {
        return await this.commandBus.execute(
            new SignupCommand(
                request.email,
                request.nickname,
                request.password,
            ),
        );
    }

    @ApiOperation({
        summary: 'Log In',
        description:
            'returns access token and expiration of matching user and sets refresh token to http only cookie',
    })
    @ApiOkResponse({ type: OmitType(AccessTokenResponse, ['cookies']) })
    @ApiUnauthorizedResponse({ description: 'invalid email or password' })
    @ApiForbiddenResponse({ description: 'email is not verified' })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(SetCookieInterceptor)
    async login(@Body() request: LoginRequest): Promise<AccessTokenResponse> {
        return await this.queryBus.execute(
            new LoginQuery(request.email, request.password),
        );
    }

    @ApiOperation({
        summary: 'refresh',
        description: 'refreshes access token if refresh token is valid',
    })
    @ApiOkResponse({ type: OmitType(AccessTokenResponse, ['cookies']) })
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    @UseInterceptors(SetCookieInterceptor)
    async refresh(@GetUser() user: User): Promise<AccessTokenResponse> {
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

    @ApiOperation({
        summary: 'verify email',
        description: 'verifies the code of this email',
    })
    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Query('token') token: string): Promise<void> {
        return await this.commandBus.execute(new VerifyEmailCommand(token));
    }
}
