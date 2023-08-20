import { ApiProperty } from '@nestjs/swagger';
import { Thread } from 'src/domain/thread/entity';

export class CreateThreadResponse {
    @ApiProperty()
    public readonly id: number;

    public static from(thread: Thread): CreateThreadResponse {
        return { id: thread.id };
    }
}
