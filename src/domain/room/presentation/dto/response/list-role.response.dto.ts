import { PermissionDto } from '../internal';

export type RoleElement = {
    readonly id: number;
    readonly alias: string;
    readonly permission: PermissionDto;
    readonly memberCount: number;
    readonly isDefault: boolean;
};

export class ListRoleResponseDto {
    constructor(
        public readonly roles: RoleElement[],
        public readonly totalCount: number,
    ) {}

    public static from(roles: RoleElement[]): ListRoleResponseDto {
        return new ListRoleResponseDto(roles, roles.length);
    }
}
