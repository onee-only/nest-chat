import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { CookieDto } from './cookie.dto';

/**
 * response에 넘겨진 cookies를 httpOnly 쿠키로 만든 후 omit해준다.
 *
 * response는 반드시 CookieDto를 상속해야 한다.
 */
@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((value: any): any => {
                if (value instanceof CookieDto) {
                    const res = context.switchToHttp().getResponse<Response>();

                    value.cookies.forEach((value, key) => {
                        res.cookie(key, value, { httpOnly: true });
                    });

                    delete value.cookies;
                }
                return value;
            }),
        );
    }
}
