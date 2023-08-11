import { Thread } from 'src/domain/thread/entity';

export class CreateThreadResponse {
    constructor(public readonly id: number) {}

    public static from(thread: Thread): CreateThreadResponse {
        return new CreateThreadResponse(thread.id);
    }
}
