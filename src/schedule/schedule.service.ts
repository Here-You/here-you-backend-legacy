import { Injectable, NotFoundException } from '@nestjs/common';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { LocationEntity } from 'src/location/location.entity';
import { ScheduleEntity } from './schedule.entity';
import { UserEntity } from 'src/user/user.entity';
import { JourneyEntity } from 'src/journey/model/journey.entity';
import { UpdateScheduleDto } from './dtos/update-schedule-dto';
import { FindMonthlyScheduleDto } from './dtos/find-monthly-schedule.dto';

@Injectable()
export class ScheduleService {
  //일정 작성하기
  async updateSchedule(scheduleId, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await ScheduleEntity.findExistSchedule(scheduleId);

    if (!updateScheduleDto.latitude || !updateScheduleDto.longitude) {
      await ScheduleEntity.updateScheduleTitle(schedule, updateScheduleDto);
    } else if (!updateScheduleDto.title) {
      await this.updateScheduleLocation(schedule, updateScheduleDto);
    } else {
      await this.updateScheduleLocation(schedule, updateScheduleDto);
      await ScheduleEntity.updateScheduleTitle(schedule, updateScheduleDto);
    }

    return response(BaseResponse.SCHEDULE_UPDATED);
  }

  async updateScheduleLocation(schedule, updateScheduleDto) {
    const existLocation = await LocationEntity.findExistLocation(
      updateScheduleDto,
    );
    if (existLocation) {
      await ScheduleEntity.updateScheduleLocation(schedule, existLocation);
    } else if (schedule.location) {
      const location = LocationEntity.updateLocation(
        schedule,
        updateScheduleDto,
      );
      console.log(location);
    } else {
      const location = await LocationEntity.createLocation(updateScheduleDto);
      await ScheduleEntity.updateScheduleLocation(schedule, location);
      console.log(location);
    }
  }

  async getMonthlySchedule(userId: number, dates: FindMonthlyScheduleDto) {
    // const dates = await this.getDateRange(
    //   findMonthlyScheduleDto.year,
    //   findMonthlyScheduleDto.month,
    // );
    // console.log(dates);

    const user = await UserEntity.findExistUser(userId);

    const journeys = await JourneyEntity.findJourneysByuserId(user.id);
    const monthlyJourneys = [];
    for (const journey of journeys) {
      const start = await this.parseDate(journey.startDate);
      if (
        start.year.toString() === dates.year.toString() &&
        start.month.toString() === dates.month.toString()
      ) {
        monthlyJourneys.push(journey);
      }
    }
    return response(BaseResponse.GET_MONTHLY_JOURNEY_SUCCESS, monthlyJourneys);
  }

  // async getDateRange(year, month) {
  //   const endDate = new Date(year, month, 0);
  //   const startDate = new Date(year, month - 1, 1);
  //   return { startDate, endDate };
  // }

  async parseDate(startDate) {
    const [year, month] = startDate.split('-').map(Number);
    return { year, month };
  }
}
