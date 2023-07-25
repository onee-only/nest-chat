import { IQuery } from '@nestjs/cqrs';
import { Request } from 'express';
import { User } from 'src/domain/user/entity';

export class SubscribeNotificationQuery implements IQuery {
    constructor(public readonly user: User, public readonly req: Request) {}
}
