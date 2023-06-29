import { PermissionDto } from '../internal';

export type RoleElement = {
    readonly alias: string;
    readonly permission: PermissionDto;
    readonly memberCount: number;
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
