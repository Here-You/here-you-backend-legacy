import { Injectable, NotFoundException } from '@nestjs/common';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { LocationEntity } from 'src/location/location.entity';
import { ScheduleEntity } from './schedule.entity';

@Injectable()
export class ScheduleService {
  async updateScheduleTitle(scheduleId, scheduleTitle) {
    const schedule = await ScheduleEntity.findExistSchedule(scheduleId);
    await ScheduleEntity.updateScheduleTitle(schedule, scheduleTitle.title);

    return response(BaseResponse.SCHEDULE_UPDATED);
  }

  async updateScheduleLocation(scheduleId, scheduleLocation) {
    const schedule = await ScheduleEntity.findExistSchedule(scheduleId);
    if (schedule.location) {
      const location = LocationEntity.updateLocation(
        schedule,
        scheduleLocation,
      );
      await ScheduleEntity.updateScheduleLocation(schedule, location);
    } else {
      const location = await LocationEntity.createLocation(scheduleLocation);
      await ScheduleEntity.updateScheduleLocation(schedule, location);
    }

    return response(BaseResponse.SCHEDULE_UPDATED);
  }
}
