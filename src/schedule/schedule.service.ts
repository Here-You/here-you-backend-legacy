import { Injectable, NotFoundException } from '@nestjs/common';
import { errResponse, response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { UpdateScheduleDto } from './dtos/update-schedule-dto';
import { LocationEntity } from 'src/location/location.entity';
import { ScheduleEntity } from './schedule.entity';

@Injectable()
export class ScheduleService {
  async updateSchedule(
    scheduleId: number,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const location = await LocationEntity.createLocation(
      updateScheduleDto.latitude,
      updateScheduleDto.longitude,
    );
    const schedule = await this.findExistSchedule(scheduleId);
    await ScheduleEntity.updateSchedule(schedule, updateScheduleDto, location);

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
