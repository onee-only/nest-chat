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
import { MemberRoleController } from './presentation/member-role.controller';
import { RoomMemberController } from './presentation/room-member.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './command/handler';
import { QueryHandlers } from './query/handler';
import { PermissionChecker } from './util';
import { InvitationController } from './presentation/invitation.controller';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Room, RoomMember, MemberRole, Invitation]),
    ],
    controllers: [
        RoomController,
        MemberRoleController,
        RoomMemberController,
        InvitationController,
    ],
    providers: [
        // handlers
        ...CommandHandlers,
        ...QueryHandlers,

        // utils
        PermissionChecker,

        // repositories
        RoomRepository,
        MemberRoleRepository,
        RoomMemberRepository,
        InvitationRepository,
    ],
    exports: [PermissionChecker, RoomRepository],
})
export class RoomModule {}
