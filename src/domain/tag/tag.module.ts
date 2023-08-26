import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entity/tag.entity';
import { TagRepository } from './repository/tag.repository';
import { ListTagHandler } from './query/handler';
import { TagController } from './presentation/tag.controller';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([Tag])],
    controllers: [TagController],
    providers: [ListTagHandler, TagRepository],
    exports: [TagRepository],
})
export class TagModule {}
