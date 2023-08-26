import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from '../logout.command';
import { Inject } from '@nestjs/common';
import { BlackListService } from 'src/global/modules/cache';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
    constructor(
        @Inject(BlackListService)
        private readonly blackListService: BlackListService,
    ) {}

    async execute(command: LogoutCommand): Promise<void> {
        const { token } = command;
        await this.blackListService.addToList(token);
    }
}
