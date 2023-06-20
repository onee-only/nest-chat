import { Test, TestingModule } from '@nestjs/testing';
import { AvatarRepository, UserRepository } from 'src/domain/user/repository';
import { PasswordManager } from '../../util';
import { EventBus } from '@nestjs/cqrs';
import { SignupHandler } from '../handler/signup.handler';
import { Avatar, User } from 'src/domain/user/entity';
import { SignupCommand } from '../signup.command';
import { DuplicateEmailException } from '../../exception';
import { DuplicateNicknameException } from 'src/domain/user/exception';

describe('SignupHandler', () => {
    let signupHandler: SignupHandler;
    let userRepository: UserRepository;
    let avatarRepository: AvatarRepository;
    let passwordManager: PasswordManager;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SignupHandler,
                {
                    provide: UserRepository,
                    useValue: {
                        existsByEmail: jest.fn(),
                        create: jest.fn(() => {
                            const user = new User();
                            user.id = 1;
                            return user;
                        }),
                        save: jest.fn(),
                    },
                },
                {
                    provide: AvatarRepository,
                    useValue: {
                        existsByNickname: jest.fn(),
                        create: jest.fn(() => {
                            return new Avatar();
                        }),
                    },
                },
                {
                    provide: PasswordManager,
                    useValue: {
                        hash: jest.fn(),
                    },
                },
                {
                    provide: EventBus,
                    useValue: {
                        publish: jest.fn(),
                    },
                },
            ],
        }).compile();

        signupHandler = module.get(SignupHandler);
        userRepository = module.get(UserRepository);
        avatarRepository = module.get(AvatarRepository);
        passwordManager = module.get(PasswordManager);
    });

    it('should create a user', async () => {
        // given
        jest.spyOn(userRepository, 'existsByEmail').mockImplementation(
            async () => false,
        );
        jest.spyOn(avatarRepository, 'existsByNickname').mockImplementation(
            async () => false,
        );
        const command = new SignupCommand('email', 'password', 'nickname');

        // when
        const { userID } = await signupHandler.execute(command);

        expect(userID).toBeDefined();
    });

    it('should throw DuplicateEmailException', async () => {
        // given
        jest.spyOn(userRepository, 'existsByEmail').mockImplementation(
            async () => true,
        );
        jest.spyOn(avatarRepository, 'existsByNickname').mockImplementation(
            async () => false,
        );
        const command = new SignupCommand('email', 'password', 'nickname');

        // when & then
        expect(signupHandler.execute(command)).rejects.toThrow(
            DuplicateEmailException,
        );
    });

    it('should throw DuplicateNicknameException', async () => {
        // given
        jest.spyOn(userRepository, 'existsByEmail').mockImplementation(
            async () => false,
        );
        jest.spyOn(avatarRepository, 'existsByNickname').mockImplementation(
            async () => true,
        );
        const command = new SignupCommand('email', 'password', 'nickname');

        // when & then
        expect(signupHandler.execute(command)).rejects.toThrow(
            DuplicateNicknameException,
        );
    });
});
