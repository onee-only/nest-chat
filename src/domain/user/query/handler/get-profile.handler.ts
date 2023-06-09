import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from '../get-profile.query';
import { GetMyProfileResponseDto } from '../../presentation/dto/response';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {
    async execute(query: GetProfileQuery): Promise<GetMyProfileResponseDto> {
        const { user } = query;
        return GetMyProfileResponseDto.from(user);
    }
}
