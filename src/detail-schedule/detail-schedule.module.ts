import { Module } from '@nestjs/common';
import { DetailScheduleService } from './detail-schedule.service';
import { DetailScheduleController } from './detail-schedule.controller';
@Module({
  controllers: [DetailScheduleController],
  providers: [DetailScheduleService],
})
export class LocationModule {}
