import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListTagQuery } from '../list-tag.query';
import { ListTagResponseDto } from '../../presentation/dto/response';
import { TagRepository } from '../../repository/tag.repository';
import { Like } from 'typeorm';

@QueryHandler(ListTagQuery)
export class ListTagHandler implements IQueryHandler<ListTagQuery> {
    constructor(private readonly tagRepository: TagRepository) {}

    async execute(query: ListTagQuery): Promise<ListTagResponseDto> {
        const { keyword, limit } = query;

        const tags = await this.tagRepository.find({
            where: { name: Like(`%${keyword}%`) },
            take: limit,
        });

        return ListTagResponseDto.from(tags);
    }
}
