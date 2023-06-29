import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMemberQuery } from '../list-member.query';
import { ListMemberResponseDto } from '../../presentation/dto/response';
import { RoomMemberRepository, RoomRepository } from '../../repository';
import { RoomNotFoundException } from '../../exception';
import { PermissionChecker } from '../../util';

@QueryHandler(ListMemberQuery)
export class ListMemberHandler implements IQueryHandler<ListMemberQuery> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(query: ListMemberQuery): Promise<ListMemberResponseDto> {
        const { roomID, user } = query;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        await this.permissionChecker.checkOrThrow({ room, user });

        const members = await this.roomMemberRepository.findWithAvatarByRoom(
            room,
        );

        return ListMemberResponseDto.from(members);
    }
}
