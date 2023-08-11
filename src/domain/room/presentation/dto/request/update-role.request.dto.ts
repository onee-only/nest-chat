import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmptyObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Permission } from '../internal';

export class UpdateRoleRequest {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => Permission)
    permission?: Permission;
}
