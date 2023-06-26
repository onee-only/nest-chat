import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlackListService } from 'src/global/modules/cache';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {
    constructor(
        @Inject(BlackListService)
        private readonly blackListService: BlackListService,
    ) {
        super();
    }

    override async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const refresh = request.cookies['refreshToken'] as string;

        const exists = await this.blackListService.existsOnList(refresh);
        if (exists) {
            return false;
        }

        return super.canActivate(context) as Promise<boolean>;
    }
}
