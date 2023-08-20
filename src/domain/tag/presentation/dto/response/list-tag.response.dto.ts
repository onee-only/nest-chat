import { ApiProperty } from '@nestjs/swagger';
import { Tag } from 'src/domain/tag/entity/tag.entity';

export class ListTagResponse {
    @ApiProperty()
    public readonly tags: string[];

    public static from(tags: Tag[]): ListTagResponse {
        return { tags: tags.map((tag) => tag.name) };
    }
}
