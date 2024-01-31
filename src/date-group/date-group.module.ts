// dateGroup.module.ts
import { Module } from '@nestjs/common';
import { DateGroupController } from './date-group.controller';
import { DateGroupService } from './date-group.service';

@Module({
  controllers: [DateGroupController],
  providers: [DateGroupService],
})
export class DateGroupModule {}
