import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entity/tag.entity';
import { TagRepository } from './repository/tag.repository';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([Tag])],
    providers: [TagRepository],
    exports: [TagRepository],
})
export class TagModule {}
