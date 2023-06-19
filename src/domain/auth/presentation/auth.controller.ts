import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
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
import { SignupCommand } from '../command';
import { SetCookieInterceptor } from 'src/global/interceptors/cookie';
import { LoginQuery } from '../query';

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
        return this.commandBus.execute(
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
        return this.queryBus.execute(
            new LoginQuery(request.email, request.password),
        );
    }
}
