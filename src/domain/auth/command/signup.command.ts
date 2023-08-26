import { ICommand } from '@nestjs/cqrs';

export class SignupCommand implements ICommand {
    constructor(
        readonly email: string,
        readonly nickname: string,
        readonly password: string,
    ) {}
}
