import { Test, TestingModule } from '@nestjs/testing';
import { JwtProvider } from '../../util';
import { UserRepository } from 'src/domain/user/repository';
import { LoginHandler } from '../handler/login.handler';
import { User } from 'src/domain/user/entity';
import { LoginQuery } from '../login.query';
import { InvalidCredentialsException } from '../../exception';

describe('LoginHandler', () => {
    let loginHandler: LoginHandler;
    let jwtProvider: JwtProvider;
    let userRepository: UserRepository;

    const SAMPLE_USER_ID = 1;
    const SAMPLE_ACCESS_TOKEN = 'hello there';
    const SAMPLE_ACCESS_EXPIRATION = 86400;
    const SAMPLE_REFRESH_TOKEN = 'hello there';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginHandler,
                {
                    provide: UserRepository,
                    useValue: {
                        findIdByEmailAndPassword: jest.fn(),
                        create: jest.fn(() => {
                            const user = new User();
                            user.id = SAMPLE_USER_ID;
                            return user;
                        }),
                        save: jest.fn(),
                    },
                },
                {
                    provide: JwtProvider,
                    useValue: {
                        provideAccess: jest.fn(() => SAMPLE_ACCESS_TOKEN),
                        provideRefresh: jest.fn(() => SAMPLE_REFRESH_TOKEN),
                        getAccessExpiration: jest.fn(
                            () => SAMPLE_ACCESS_EXPIRATION,
                        ),
                    },
                },
            ],
        }).compile();

        userRepository = module.get(UserRepository);
        jwtProvider = module.get(JwtProvider);
        loginHandler = module.get(LoginHandler);
    });

    it('should provide tokens', async () => {
        // given
        jest.spyOn(
            userRepository,
            'findIdByEmailAndPassword',
        ).mockImplementation(async () => SAMPLE_USER_ID);
        const query = new LoginQuery('email', 'password');

        // when
        const { accessToken, cookies, exp } = await loginHandler.execute(query);

        // then
        expect(accessToken).toEqual(SAMPLE_ACCESS_TOKEN);
        expect(cookies.get('refreshToken')).toEqual(SAMPLE_REFRESH_TOKEN);
        expect(exp).toEqual(SAMPLE_ACCESS_EXPIRATION);
    });

    it('should throw InvalidCredentialsException', async () => {
        // given
        jest.spyOn(
            userRepository,
            'findIdByEmailAndPassword',
        ).mockImplementation(async () => undefined);
        const query = new LoginQuery('email', 'password');

        // when & then
        expect(loginHandler.execute(query)).rejects.toThrow(
            InvalidCredentialsException,
        );
    });
});
