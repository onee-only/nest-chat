import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
    OmitType,
} from '@nestjs/swagger';
import {
    LoginRequest,
    SignupRequest,
    UpdatePasswordRequest,
} from './dto/request';
import { AccessTokenResponse, SignupResponse } from './dto/response';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    LogoutCommand,
    SignupCommand,
    UpdatePasswordCommand,
    VerifyEmailCommand,
} from '../command';
import { LoginQuery, RefreshQuery } from '../query';
import { JwtAuthGuard, RefreshAuthGuard } from 'src/global/guards';
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
    @ApiHeader({ name: 'Cookie' })
    @ApiOkResponse({ type: OmitType(AccessTokenResponse, ['cookies']) })
    @ApiForbiddenResponse({ description: 'refresh token is invalid' })
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
    @ApiHeader({ name: 'Cookie' })
    @ApiOkResponse()
    @ApiForbiddenResponse({ description: 'refresh token is invalid' })
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    async logout(@GetRefresh() token: string): Promise<void> {
        return await this.commandBus.execute(new LogoutCommand(token));
    }

    @ApiOperation({
        summary: 'verify email',
        description: 'verifies the code of this email',
    })
    @ApiBadRequestResponse({ description: 'the token is invalid' })
    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Query('token') token: string): Promise<void> {
        return await this.commandBus.execute(new VerifyEmailCommand(token));
    }

    @ApiOperation({
        summary: 'verify email',
        description: 'verifies the code of this email',
    })
    @ApiOkResponse()
    @ApiForbiddenResponse({ description: 'current password is invalid' })
    @Patch('update-password')
    @UseGuards(JwtAuthGuard)
    async updatePassword(
        @GetUser() user: User,
        @Body() request: UpdatePasswordRequest,
    ): Promise<void> {
        const { currentPassword, newPassword } = request;
        return await this.commandBus.execute(
            new UpdatePasswordCommand(user, currentPassword, newPassword),
        );
    }
}
