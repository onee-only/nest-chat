import { ListThreadElement } from '../internal';

type ListInfo = {
    readonly pageNum: number;
    readonly pageSize: number;
    readonly totalPages: number;
    readonly totalThreads: number;
};

export class ListThreadReponseDto {
    constructor(
        public readonly threads: ListThreadElement[],
        public readonly pageInfo: ListInfo,
    ) {}

    public static from(
        threads: ListThreadElement[],
        pageInfo: ListInfo,
    ): ListThreadReponseDto {
        return new ListThreadReponseDto(threads, pageInfo);
    }
}
