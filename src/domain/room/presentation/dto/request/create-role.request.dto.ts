import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNotEmptyObject,
    IsString,
    ValidateNested,
} from 'class-validator';
import { PermissionDto } from '../internal';

export class CreateRoleRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionDto)
    permission: PermissionDto;
}
