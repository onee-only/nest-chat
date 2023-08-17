import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string> {
    private readonly regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
    private readonly isRequired: boolean;

    constructor({ isRequired }: { isRequired: boolean }) {
        this.isRequired = isRequired;
    }

    async transform(value: string, metadata: ArgumentMetadata) {
        if ((this.isRequired && value == null) || this.regex.test(value)) {
            throw new BadRequestException(
                'Validation failed (date string of format [yyyy-mm-dd] is expected)',
            );
        }
        return new Date(Date.parse(value));
    }
}
