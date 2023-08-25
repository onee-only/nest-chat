import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetreiveMemberQuery } from '../retreive-member.query';
import { RetreiveMemberResponse } from '../../presentation/dto/response';
import { RoomMemberRepository, RoomRepository } from '../../repository';
import { PermissionChecker } from '../../util';
import { RoomNotFoundException } from '../../exception';

@QueryHandler(RetreiveMemberQuery)
export class RetreiveMemberHandler
    implements IQueryHandler<RetreiveMemberQuery>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(query: RetreiveMemberQuery): Promise<RetreiveMemberResponse> {
        const { memberID, roomID, user } = query;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        await this.permissionChecker.checkOrThrow({ room, user });

        const member = await this.roomMemberRepository.findOneOrFail({
            relations: { user: { avatar: true } },
            where: { roomID, userID: memberID },
        });

        return RetreiveMemberResponse.from(member);
    }
}
