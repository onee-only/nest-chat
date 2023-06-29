import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListRoleQuery } from '../list-role.query';
import { ListRoleResponseDto } from '../../presentation/dto/response';
import { RoomNotFoundException } from '../../exception';
import { MemberRoleRepository, RoomRepository } from '../../repository';
import { PermissionChecker } from '../../util';

@QueryHandler(ListRoleQuery)
export class ListRoleHandler implements IQueryHandler<ListRoleQuery> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly memberRoleRepository: MemberRoleRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(query: ListRoleQuery): Promise<ListRoleResponseDto> {
        const { roomID, user } = query;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        await this.permissionChecker.checkOrThrow({
            room: room,
            user: user,
        });

        const roles = await this.memberRoleRepository.findWithMemberCountByRoom(
            room,
        );

        return ListRoleResponseDto.from(roles);
    }
}
