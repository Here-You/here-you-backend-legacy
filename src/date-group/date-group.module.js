// dateGroup.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dateGroupController } from './dateGroup.controller';
import { dateGroupService } from './dateGroup.service';
import { dateGroupRepository } from './dateGroup.repository';

@Module({
  imports: [TypeOrmModule.forFeature([dateGroupEntity])],
  controllers: [dateGroupController],
  providers: [dateGroupService, dateGroupRepository],
})
export class dateGroupModule {}
