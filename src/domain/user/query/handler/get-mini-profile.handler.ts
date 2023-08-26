import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMiniProfileQuery } from '../get-mini-profile.query';
import { GetMeResponse } from '../../presentation/dto/response';

@QueryHandler(GetMiniProfileQuery)
export class GetMiniProfileHandler
    implements IQueryHandler<GetMiniProfileQuery>
{
    async execute(query: GetMiniProfileQuery): Promise<GetMeResponse> {
        const { user } = query;
        return await GetMeResponse.from(user);
    }
}
