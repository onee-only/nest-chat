import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity';

@Module({
    imports: [TypeOrmModule.forFeature([Notification])],
    controllers: [],
    providers: [],
})
export class NotificationModule {}
