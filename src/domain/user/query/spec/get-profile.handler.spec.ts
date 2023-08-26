import { Test, TestingModule } from '@nestjs/testing';
import { GetProfileHandler } from '../handler/get-profile.handler';
import { Avatar, User } from '../../entity';
import { GetProfileQuery } from '../get-profile.query';

describe('GetProfileHandler', () => {
    let getProfileHandler: GetProfileHandler;

    const SAMPLE_USER_ID = 1;
    const SAMPLE_NICKNAME = 'hi';
    const SAMPLE_PROFILE_URL = 'pfp';
    const SAMPLE_EMAIL = 'email';
    const SAMPLE_JOINED_AT = new Date();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GetProfileHandler],
        }).compile();

        getProfileHandler = module.get(GetProfileHandler);
    });

    it('should provide profile info', async () => {
        // given
        const avatar = new Avatar();
        avatar.nickname = SAMPLE_NICKNAME;
        avatar.profileURL = SAMPLE_PROFILE_URL;
        avatar.bio = 'afe';

        const user = new User();
        user.id = SAMPLE_USER_ID;
        user.email = SAMPLE_EMAIL;
        user.joinedAt = SAMPLE_JOINED_AT;
        user.avatar = avatar;

        const query = new GetProfileQuery(user);

        // when
        const {
            profile: { nickname },
            user: { id, email },
        } = await getProfileHandler.execute(query);

        // then
        expect(nickname).toEqual(SAMPLE_NICKNAME);
        expect(email).toEqual(SAMPLE_EMAIL);
        expect(id).toEqual(SAMPLE_USER_ID);
    });
});
