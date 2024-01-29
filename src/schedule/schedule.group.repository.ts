// journey.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ScheduleGroupEntity } from './schedule.group.entity';
import { CreateScheduleGroupDto } from './schedule-dto/create-schedule-group.dto';

@Injectable()
export class ScheduleRepository extends Repository<ScheduleGroupEntity> {
  async createScheduleGroup(
    scheduleGroupInfo: CreateScheduleGroupDto,
  ): Promise<boolean> {
    const { date, journeyId } = scheduleGroupInfo;
    const scheduleGroup = this.create({
      date: date,
      journey: { id: journeyId },
    });

    await this.save(scheduleGroup);
    return true;
  }
}
