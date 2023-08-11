import { Permission } from '../internal';

export type RoleElement = {
    readonly id: number;
    readonly alias: string;
    readonly permission: Permission;
    readonly memberCount: number;
    readonly isDefault: boolean;
};

export class ListRoleResponse {
    constructor(
        public readonly roles: RoleElement[],
        public readonly totalCount: number,
    ) {}

    public static from(roles: RoleElement[]): ListRoleResponse {
        return new ListRoleResponse(roles, roles.length);
    }
}
