import { Test, TestingModule } from '@nestjs/testing';
import { MemberRoleRepository, RoomRepository } from '../../repository';
import { RoomAdminChecker } from '../../util';
import { UpdateRoomHandler } from '../handler/update-room.handler';
import { MemberRole, Room } from '../../entity';
import { UpdateRoomCommand } from '../update-room.command';
import { User } from 'src/domain/user/entity';
import {
    NoAdminPermissionException,
    NoMatchingRoleException,
    RoomNotFoundException,
} from '../../exception';

describe('UpdateRoomHandler', () => {
    let updateRoomHandler: UpdateRoomHandler;
    let roomRepsitory: RoomRepository;
    let memberRoleRepository: MemberRoleRepository;
    let roomAdminChecker: RoomAdminChecker;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateRoomHandler,
                {
                    provide: RoomRepository,
                    useValue: {
                        findOneBy: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: MemberRoleRepository,
                    useValue: {
                        findOneBy: jest.fn(),
                    },
                },
                {
                    provide: RoomAdminChecker,
                    useValue: {
                        checkOrThrow: jest.fn(),
                    },
                },
            ],
        }).compile();

        updateRoomHandler = module.get(UpdateRoomHandler);
        roomRepsitory = module.get(RoomRepository);
        memberRoleRepository = module.get(MemberRoleRepository);
        roomAdminChecker = module.get(RoomAdminChecker);
    });

    it('should update a room', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneBy').mockImplementation(
            async () => new Room(),
        );
        jest.spyOn(roomAdminChecker, 'checkOrThrow').mockImplementation(
            async () => undefined,
        );
        jest.spyOn(memberRoleRepository, 'findOneBy').mockImplementation(
            async () => new MemberRole(),
        );
        const command = new UpdateRoomCommand(new User(), 1, {
            isPublic: true,
        });

        // when & then
        expect(updateRoomHandler.execute(command)).resolves.not.toThrow();
    });

    it('should throw RoomNotFoundException', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneBy').mockImplementation(
            async () => null,
        );
        jest.spyOn(roomAdminChecker, 'checkOrThrow').mockImplementation(
            async () => undefined,
        );
        jest.spyOn(memberRoleRepository, 'findOneBy').mockImplementation(
            async () => new MemberRole(),
        );
        const command = new UpdateRoomCommand(new User(), 1, {
            isPublic: true,
        });

        // when & then
        expect(updateRoomHandler.execute(command)).rejects.toThrow(
            RoomNotFoundException,
        );
    });

    it('should throw NoAdminPermissionException', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneBy').mockImplementation(
            async () => new Room(),
        );
        jest.spyOn(roomAdminChecker, 'checkOrThrow').mockImplementation(
            async () => {
                throw new NoAdminPermissionException();
            },
        );
        jest.spyOn(memberRoleRepository, 'findOneBy').mockImplementation(
            async () => new MemberRole(),
        );
        const command = new UpdateRoomCommand(new User(), 1, {
            isPublic: true,
        });

        // when & then
        expect(updateRoomHandler.execute(command)).rejects.toThrow(
            NoAdminPermissionException,
        );
    });

    it('should throw NoMatchingRoleException', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneBy').mockImplementation(
            async () => new Room(),
        );
        jest.spyOn(roomAdminChecker, 'checkOrThrow').mockImplementation(
            async () => undefined,
        );
        jest.spyOn(memberRoleRepository, 'findOneBy').mockImplementation(
            async () => undefined,
        );
        const command = new UpdateRoomCommand(new User(), 1, {
            defaultRoleID: 1,
        });

        // when & then
        expect(updateRoomHandler.execute(command)).rejects.toThrow(
            NoMatchingRoleException,
        );
    });
});
