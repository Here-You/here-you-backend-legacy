// dateGroup.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateGroupController } from './date-group.controller';
import { DateGroupService } from './date-group.service';
import { DateGroupRepository } from './date-group.repository';
import { EntityManager } from 'typeorm';
import { DateGroupEntity } from './date-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DateGroupEntity])],
  controllers: [DateGroupController],
  providers: [DateGroupService, DateGroupRepository, EntityManager],
})
export class DateGroupModule {}
