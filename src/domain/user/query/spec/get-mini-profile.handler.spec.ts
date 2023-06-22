import { Test, TestingModule } from '@nestjs/testing';
import { GetMiniProfileHandler } from '../handler/get-mini-profile.handler';
import { Avatar, User } from '../../entity';
import { GetMiniProfileQuery } from '../get-mini-profile.query';
describe('GetMiniProfileHandler', () => {
    let getMiniProfileHandler: GetMiniProfileHandler;

    const SAMPLE_USER_ID = 1;
    const SAMPLE_NICKNAME = 'hi';
    const SAMPLE_PROFILE_URL = 'pfp';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GetMiniProfileHandler],
        }).compile();

        getMiniProfileHandler = module.get(GetMiniProfileHandler);
    });

    it('should provide mini profile info', async () => {
        // given
        const avatar = new Avatar();
        avatar.nickname = SAMPLE_NICKNAME;
        avatar.profileURL = SAMPLE_PROFILE_URL;

        const user = new User();
        user.id = SAMPLE_USER_ID;
        user.avatar = avatar;

        const query = new GetMiniProfileQuery(user);

        // when
        const { nickname, profileURL, userID } =
            await getMiniProfileHandler.execute(query);

        // then
        expect(nickname).toEqual(SAMPLE_NICKNAME);
        expect(profileURL).toEqual(SAMPLE_PROFILE_URL);
        expect(userID).toEqual(SAMPLE_USER_ID);
    });
});
