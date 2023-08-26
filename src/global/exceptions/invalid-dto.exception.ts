import { InternalServerErrorException } from '@nestjs/common';

/**
 * @param expected 예상한 값
 * @param actual 실제 값
 */
export class InvalidDtoException extends InternalServerErrorException {
    constructor(expected: any, actual: any) {
        super(
            `Invalid type of dto found. expected: ${typeof expected}, actual: ${typeof actual}.`,
        );
    }
}
