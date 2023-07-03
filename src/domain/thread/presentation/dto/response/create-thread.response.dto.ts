import { Thread } from 'src/domain/thread/entity';

export class CreateThreadResponseDto {
    constructor(public readonly id: number) {}

    public static from(thread: Thread): CreateThreadResponseDto {
        return new CreateThreadResponseDto(thread.id);
    }
}
