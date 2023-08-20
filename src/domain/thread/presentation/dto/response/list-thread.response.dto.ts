import { ApiProperty } from '@nestjs/swagger';
import { ListThreadElement } from '../internal';

class ListInfo {
    @ApiProperty()
    public readonly pageNum: number;

    @ApiProperty()
    public readonly pageSize: number;

    @ApiProperty()
    public readonly totalPages: number;

    @ApiProperty()
    public readonly totalThreads: number;
}

export class ListThreadReponseDto {
    @ApiProperty({ type: [ListThreadElement] })
    public readonly threads: ListThreadElement[];

    @ApiProperty()
    public readonly pageInfo: ListInfo;

    public static from(
        threads: ListThreadElement[],
        pageInfo: ListInfo,
    ): ListThreadReponseDto {
        return { threads, pageInfo };
    }
}
