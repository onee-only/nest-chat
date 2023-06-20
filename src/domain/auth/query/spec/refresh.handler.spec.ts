import { Test, TestingModule } from '@nestjs/testing';
import { JwtProvider } from '../../util';
import { User } from 'src/domain/user/entity';
import { RefreshHandler } from '../handler/refresh.handler';
import { RefreshQuery } from '../refresh.query';

describe('RefreshHandler', () => {
    let refreshHandler: RefreshHandler;
    let jwtProvider: JwtProvider;

    const SAMPLE_USER_ID = 1;
    const SAMPLE_ACCESS_TOKEN = 'hello there';
    const SAMPLE_ACCESS_EXPIRATION = 86400;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RefreshHandler,
                {
                    provide: JwtProvider,
                    useValue: {
                        provideAccess: jest.fn(() => SAMPLE_ACCESS_TOKEN),
                        getAccessExpiration: jest.fn(
                            () => SAMPLE_ACCESS_EXPIRATION,
                        ),
                    },
                },
            ],
        }).compile();

        refreshHandler = module.get(RefreshHandler);
        jwtProvider = module.get(JwtProvider);
    });

    it('should provide tokens', async () => {
        // given
        const user = new User();
        user.id = SAMPLE_USER_ID;

        const query = new RefreshQuery(user);

        // when
        const { accessToken, cookies, exp } = await refreshHandler.execute(
            query,
        );

        // then
        expect(accessToken).toEqual(SAMPLE_ACCESS_TOKEN);
        expect(cookies.size).toEqual(0);
        expect(exp).toEqual(SAMPLE_ACCESS_EXPIRATION);
    });
});
