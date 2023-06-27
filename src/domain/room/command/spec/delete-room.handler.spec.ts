import { Test, TestingModule } from '@nestjs/testing';
import { RoomRepository } from '../../repository';
import { RoomAdminChecker } from '../../util';
import { Room } from '../../entity';
import { User } from 'src/domain/user/entity';
import {
    NoAdminPermissionException,
    RoomNotFoundException,
} from '../../exception';
import { DeleteRoomHandler } from '../handler/delete-room.handler';
import { DeleteRoomCommand } from '../delete-room.command';

describe('DeleteRoomHandler', () => {
    let deleteRoomHandler: DeleteRoomHandler;
    let roomRepsitory: RoomRepository;
    let roomAdminChecker: RoomAdminChecker;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeleteRoomHandler,
                {
                    provide: RoomRepository,
                    useValue: {
                        findOneBy: jest.fn(),
                        delete: jest.fn(),
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

        deleteRoomHandler = module.get(DeleteRoomHandler);
        roomRepsitory = module.get(RoomRepository);
        roomAdminChecker = module.get(RoomAdminChecker);
    });

    it('should delete a room', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneBy').mockImplementation(
            async () => new Room(),
        );
        jest.spyOn(roomAdminChecker, 'checkOrThrow').mockImplementation(
            async () => undefined,
        );
        const command = new DeleteRoomCommand(new User(), 1);

        // when & then
        expect(deleteRoomHandler.execute(command)).resolves.not.toThrow();
    });

    it('should throw RoomNotFoundException', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneBy').mockImplementation(
            async () => null,
        );
        jest.spyOn(roomAdminChecker, 'checkOrThrow').mockImplementation(
            async () => undefined,
        );
        const command = new DeleteRoomCommand(new User(), 1);

        // when & then
        expect(deleteRoomHandler.execute(command)).rejects.toThrow(
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
        const command = new DeleteRoomCommand(new User(), 1);

        // when & then
        expect(deleteRoomHandler.execute(command)).rejects.toThrow(
            NoAdminPermissionException,
        );
    });
});
