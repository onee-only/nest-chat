import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from '../get-profile.query';
import { GetMyProfileResponse } from '../../presentation/dto/response';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {
    async execute(query: GetProfileQuery): Promise<GetMyProfileResponse> {
        const { user } = query;
        return GetMyProfileResponse.from(user);
    }
}
