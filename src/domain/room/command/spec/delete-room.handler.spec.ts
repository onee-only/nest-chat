import { Test, TestingModule } from '@nestjs/testing';
import { RoomRepository } from '../../repository';
import { Room } from '../../entity';
import { User } from 'src/domain/user/entity';
import {
    NoOwnerPermissionException,
    RoomNotFoundException,
} from '../../exception';
import { DeleteRoomHandler } from '../handler/delete-room.handler';
import { DeleteRoomCommand } from '../delete-room.command';

describe('DeleteRoomHandler', () => {
    let deleteRoomHandler: DeleteRoomHandler;
    let roomRepsitory: RoomRepository;

    const theUser = new User();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeleteRoomHandler,
                {
                    provide: RoomRepository,
                    useValue: {
                        findOneWithOwnerById: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        deleteRoomHandler = module.get(DeleteRoomHandler);
        roomRepsitory = module.get(RoomRepository);
    });

    it('should delete a room', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneWithOwnerById').mockImplementation(
            async () => {
                const room = new Room();
                room.owner = theUser;
                return room;
            },
        );
        const command = new DeleteRoomCommand(theUser, 1);

        // when & then
        expect(deleteRoomHandler.execute(command)).resolves.not.toThrow();
    });

    it('should throw RoomNotFoundException', async () => {
        // given
        jest.spyOn(roomRepsitory, 'findOneWithOwnerById').mockImplementation(
            async () => null,
        );
        const command = new DeleteRoomCommand(theUser, 1);

        // when & then
        expect(deleteRoomHandler.execute(command)).rejects.toThrow(
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
        const command = new DeleteRoomCommand(theUser, 1);

        // when & then
        expect(deleteRoomHandler.execute(command)).rejects.toThrow(
            NoOwnerPermissionException,
        );
    });
});
