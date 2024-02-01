import { Injectable, NotFoundException } from '@nestjs/common';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { LocationEntity } from 'src/location/location.entity';
import { ScheduleEntity } from './models/schedule.entity';

@Injectable()
export class ScheduleService {
  async updateScheduleTitle(scheduleId, scheduleTitle) {
    const schedule = await this.findExistSchedule(scheduleId);
    await ScheduleEntity.updateScheduleTitle(schedule, scheduleTitle.title);

    return response(BaseResponse.SCHEDULE_UPDATED);
  }

  async updateScheduleLocation(scheduleId, scheduleLocation) {
    const schedule = await this.findExistSchedule(scheduleId);
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
