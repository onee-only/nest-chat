import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignupRequestDto } from './dto/request';
import { SignupResponseDto } from './dto/response';
import { CommandBus } from '@nestjs/cqrs';
import { SignupCommand } from '../command';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({
        summary: '회원가입',
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
}
