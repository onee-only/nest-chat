import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../internal';

export class RoleElement {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly alias: string;

    @ApiProperty()
    public readonly permission: Permission;

    @ApiProperty()
    public readonly memberCount: number;

    @ApiProperty()
    public readonly isDefault: boolean;
}

export class ListRoleResponse {
    @ApiProperty({ type: [RoleElement] })
    public readonly roles: RoleElement[];

    @ApiProperty()
    public readonly totalCount: number;

    public static from(roles: RoleElement[]): ListRoleResponse {
        return { roles: roles, totalCount: roles.length };
    }
}
