import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNotEmptyObject,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Permission } from '../internal';

export class CreateRoleRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    name: string;

    @ApiProperty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => Permission)
    permission: Permission;
}
