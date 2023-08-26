import { Test, TestingModule } from '@nestjs/testing';
import { MemberRoleRepository, RoomRepository } from '../../repository';
import { MemberRole, Room } from '../../entity';
import { User } from 'src/domain/user/entity';
import { RoomNotFoundException } from '../../exception';
import { CreateRoleHandler } from '../handler/create-role.handler';
import { PermissionChecker } from '../../util';
import { CreateRoleCommand } from '../create-role.command';

describe('CreateRoleHandler', () => {
    let createRoleHandler: CreateRoleHandler;
    let roomRepository: RoomRepository;
    let memberRoleRepository: MemberRoleRepository;
    let permissionChecker: PermissionChecker;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateRoleHandler,
                {
                    provide: RoomRepository,
                    useValue: {
                        findOneBy: jest.fn(),
                    },
                },
                {
                    provide: MemberRoleRepository,
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: PermissionChecker,
                    useValue: {
                        checkAvailableOrThrow: jest.fn(),
                    },
                },
            ],
        }).compile();

        createRoleHandler = module.get(CreateRoleHandler);
        roomRepository = module.get(RoomRepository);
        memberRoleRepository = module.get(MemberRoleRepository);
        permissionChecker = module.get(PermissionChecker);
    });

    it('should update a room', async () => {
        // given
        jest.spyOn(roomRepository, 'findOneBy').mockImplementation(
            async () => new Room(),
        );
        jest.spyOn(permissionChecker, 'checkOrThrow').mockImplementation(
            async () => undefined,
        );
        jest.spyOn(memberRoleRepository, 'create').mockImplementation(
            () => new MemberRole(),
        );

        const command = new CreateRoleCommand(new User(), 1, 'hi', {
            changeRole: true,
            createThread: false,
            deleteMessage: true,
            inviteMember: true,
            kickMember: true,
            writeMessage: true,
        });

        // when & then
        expect(createRoleHandler.execute(command)).resolves.not.toThrow();
    });

    it('should throw RoomNotFoundException', async () => {
        // given
        jest.spyOn(roomRepository, 'findOneBy').mockImplementation(
            async () => null,
        );
        jest.spyOn(permissionChecker, 'checkOrThrow').mockImplementation(
            async () => undefined,
        );
        jest.spyOn(memberRoleRepository, 'create').mockImplementation(
            () => new MemberRole(),
        );
        const command = new CreateRoleCommand(new User(), 1, 'hi', {
            changeRole: true,
            createThread: false,
            deleteMessage: true,
            inviteMember: true,
            kickMember: true,
            writeMessage: true,
        });

        // when & then
        expect(createRoleHandler.execute(command)).rejects.toThrow(
            RoomNotFoundException,
        );
    });
});
