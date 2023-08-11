import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNotEmptyObject,
    IsString,
    IsUrl,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Permission } from '../internal';

class DefaultRoleDto {
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

export class CreateRoomRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    isPublic: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsUrl()
    profileURL: string;

    @ApiProperty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => DefaultRoleDto)
    defaultRole: DefaultRoleDto;
}
