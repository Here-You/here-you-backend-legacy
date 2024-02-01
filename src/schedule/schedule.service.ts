import { Injectable, NotFoundException } from '@nestjs/common';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';

import { ScheduleEntity } from './schedule.entity';

@Injectable()
export class ScheduleService {
  async updateScheduleTitle(scheduleId, scheduleTitle) {
    const schedule = await this.findExistSchedule(scheduleId);
    await ScheduleEntity.updateSchedule(schedule, scheduleTitle.title);

    return response(BaseResponse.SCHEDULE_UPDATED);
  }

  async findExistSchedule(scheduleId) {
    const schedule = await ScheduleEntity.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException(BaseResponse.SCHEDULE_NOT_FOUND);
    }
    return schedule;
  }
}
