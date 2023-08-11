import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNotEmptyObject,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Permission } from '../internal';

export class CreateRoleRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => Permission)
    permission: Permission;
}
