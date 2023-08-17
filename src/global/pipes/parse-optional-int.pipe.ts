import { ArgumentMetadata, Injectable, ParseIntPipe } from '@nestjs/common';

@Injectable()
export class ParseOptionalIntPipe extends ParseIntPipe {
    async transform(
        value: string,
        metadata: ArgumentMetadata,
    ): Promise<number> {
        return value == null ? undefined : super.transform(value, metadata);
    }
}
