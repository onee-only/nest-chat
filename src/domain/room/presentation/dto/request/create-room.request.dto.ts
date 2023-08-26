import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsNotEmptyObject,
    IsString,
    IsUrl,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Permission } from '../internal';

class DefaultRoleDto {
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

export class CreateRoomRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isPublic: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsUrl()
    @MaxLength(2048)
    profileURL: string;

    @ApiProperty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => DefaultRoleDto)
    defaultRole: DefaultRoleDto;
}
