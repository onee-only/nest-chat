import { Tag } from 'src/domain/tag/entity/tag.entity';

export class ListTagResponseDto {
    constructor(public readonly tags: string[]) {}

    public static from(tags: Tag[]): ListTagResponseDto {
        return new ListTagResponseDto(tags.map((tag) => tag.name));
    }
}
