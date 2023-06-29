import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmptyObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { PermissionDto } from '../internal';

export class UpdateRoleRequestDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PermissionDto)
    permission?: PermissionDto;
}
