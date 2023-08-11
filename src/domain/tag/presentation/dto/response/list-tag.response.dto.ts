import { Tag } from 'src/domain/tag/entity/tag.entity';

export class ListTagResponse {
    constructor(public readonly tags: string[]) {}

    public static from(tags: Tag[]): ListTagResponse {
        return new ListTagResponse(tags.map((tag) => tag.name));
    }
}
