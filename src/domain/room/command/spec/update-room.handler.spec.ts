import { Test, TestingModule } from '@nestjs/testing';
import { MemberRoleRepository, RoomRepository } from '../../repository';
import { UpdateRoomHandler } from '../handler/update-room.handler';
import { MemberRole, Room } from '../../entity';
import { UpdateRoomCommand } from '../update-room.command';
import { User } from 'src/domain/user/entity';
import {
    NoOwnerPermissionException,
    NoMatchingRoleException,
    RoomNotFoundException,
} from '../../exception';

describe('UpdateRoomHandler', () => {
    let updateRoomHandler: UpdateRoomHandler;
    let roomRepsitory: RoomRepository;
    let memberRoleRepository: MemberRoleRepository;

    const theUser = new User();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateRoomHandler,
                {
                    provide: RoomRepository,
                    useValue: {
                        findOneWithOwnerById: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: MemberRoleRepository,
                    useValue: {
                        findOneBy: jest.fn(),
                    },
                },
            ],
        }).compile();

        updateRoomHandler = module.get(UpdateRoomHandler);
        roomRepsitory = module.get(RoomRepository);
        memberRoleRepository = module.get(MemberRoleRepository);
    });

    it('should update a room', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneWithOwnerById').mockImplementation(
            async () => {
                const room = new Room();
                room.owner = theUser;
                return room;
            },
        );
        jest.spyOn(memberRoleRepository, 'findOneBy').mockImplementation(
            async () => new MemberRole(),
        );
        const command = new UpdateRoomCommand(theUser, 1, {
            isPublic: true,
        });

        // when & then
        expect(updateRoomHandler.execute(command)).resolves.not.toThrow();
    });

    it('should throw RoomNotFoundException', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneWithOwnerById').mockImplementation(
            async () => null,
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

    it('should throw NoOwnerPermissionException', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneWithOwnerById').mockImplementation(
            async () => {
                const room = new Room();
                room.owner = new User();
                return room;
            },
        );
        jest.spyOn(memberRoleRepository, 'findOneBy').mockImplementation(
            async () => new MemberRole(),
        );
        const command = new UpdateRoomCommand(theUser, 1, {
            isPublic: true,
        });

        // when & then
        expect(updateRoomHandler.execute(command)).rejects.toThrow(
            NoOwnerPermissionException,
        );
    });

    it('should throw NoMatchingRoleException', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneWithOwnerById').mockImplementation(
            async () => {
                const room = new Room();
                room.owner = theUser;
                return room;
            },
        );
        jest.spyOn(memberRoleRepository, 'findOneBy').mockImplementation(
            async () => undefined,
        );
        const command = new UpdateRoomCommand(theUser, 1, {
            defaultRoleID: 1,
        });

        // when & then
        expect(updateRoomHandler.execute(command)).rejects.toThrow(
            NoMatchingRoleException,
        );
    });
});
