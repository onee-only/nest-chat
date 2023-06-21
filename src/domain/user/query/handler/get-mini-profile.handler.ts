import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMiniProfileQuery } from '../get-mini-profile.query';
import { GetMeResponseDto } from '../../presentation/dto/response';

@QueryHandler(GetMiniProfileQuery)
export class GetMiniProfileHandler
    implements IQueryHandler<GetMiniProfileQuery>
{
    async execute(query: GetMiniProfileQuery): Promise<GetMeResponseDto> {
        const { user } = query;
        const avatar = await user.avatar;

        return await GetMeResponseDto.from(user, avatar);
    }
}
