import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation, MemberRole, Room, RoomMember } from './entity';
import {
    InvitationRepository,
    MemberRoleRepository,
    RoomMemberRepository,
    RoomRepository,
} from './repository';
import { RoomController } from './presentation/room.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './command/handler';
import { QueryHandlers } from './query/handler';
import { RoomAdminChecker } from './util';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Room, RoomMember, MemberRole, Invitation]),
    ],
    controllers: [RoomController],
    providers: [
        // handlers
        ...CommandHandlers,
        ...QueryHandlers,

        // utils
        RoomAdminChecker,

        // repositories
        RoomRepository,
        MemberRoleRepository,
        RoomMemberRepository,
        InvitationRepository,
    ],
})
export class RoomModule {}
