import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/domain/user/entity';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.user as User;
    },
);
