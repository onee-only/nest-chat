import { ICommand } from '@nestjs/cqrs';

export class SignupCommand implements ICommand {
    constructor(
        readonly email: string,
        readonly password: string,
        readonly nickname: string,
    ) {}
}
