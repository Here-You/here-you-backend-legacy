import { Injectable, NotFoundException } from '@nestjs/common';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { LocationEntity } from 'src/location/location.entity';
import { ScheduleEntity } from './schedule.entity';
import { UserEntity } from 'src/user/user.entity';
import { JourneyEntity } from 'src/journey/model/journey.entity';
import { DiaryEntity } from 'src/diary/models/diary.entity';
import { UpdateScheduleDto } from './dtos/update-schedule-dto';
import { FindMonthlyScheduleDto } from './dtos/find-monthly-schedule.dto';
import { DetailScheduleEntity } from 'src/detail-schedule/detail-schedule.entity';

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

  async getMonthlyCalender(userId: number, dates: FindMonthlyScheduleDto) {
    const user = await UserEntity.findExistUser(userId);
    const journeys = await this.getMonthlyJourney(user.id, dates);
    const schedules = await this.getMonthlySchedule(journeys, dates);
    const diaries = await this.getMonthlyDiaries(schedules);
    const data = [journeys, schedules, diaries];
    return response(BaseResponse.GET_MONTHLY_JOURNEY_SUCCESS, data);
  }

  async getMonthlyJourney(userId, dates: FindMonthlyScheduleDto) {
    const journeys = await JourneyEntity.findJourneysByuserId(userId);
    const monthlyJourneys = await Promise.all(
      journeys.map(async (journey) => {
        const startDate = await this.parseDate(journey.startDate);
        const endDate = await this.parseDate(journey.endDate);
        if (
          (startDate.year.toString() === dates.year.toString() &&
            startDate.month.toString() === dates.month.toString()) ||
          (endDate.year.toString() === dates.year.toString() &&
            endDate.month.toString() === dates.month.toString())
        ) {
          return journey;
        }
      }),
    );
    return monthlyJourneys.filter((journey) => journey !== null);
  }
  // const monthlyJourneys = [];
  // for (const journey of journeys) {
  //   const startDate = await this.parseDate(journey.startDate);
  //   if (
  //     startDate.year.toString() === dates.year.toString() &&
  //     startDate.month.toString() === dates.month.toString()
  //   ) {
  //     monthlyJourneys.push(journey);
  //   }
  // }
  // return monthlyJourneys;

  async getMonthlySchedule(journeys: JourneyEntity[], dates) {
    const monthlySchedule = await Promise.all(
      journeys.map(async (journey) => {
        const schedules = await ScheduleEntity.findExistScheduleByJourneyId(
          journey,
        );
        const monthlySchedules = [];
        for (const schedule of schedules) {
          const scheduleDate = await this.parseDate(schedule.date);
          if (
            scheduleDate.year.toString() === dates.year.toString() &&
            scheduleDate.month.toString() === dates.month.toString()
          ) {
            monthlySchedules.push(schedule);
          }
        }
        console.log(monthlySchedules);
        return monthlySchedules;
      }),
    );
    return monthlySchedule;
  }

  async getMonthlyDetailSchedules(schedules: ScheduleEntity[]) {
    const monthlyDetailSchedules = [];
    for (const schedule of schedules) {
      const detailSchedules: DetailScheduleEntity[] =
        await DetailScheduleEntity.findExistDetailByScheduleId(schedule);
      monthlyDetailSchedules.push(detailSchedules);
    }
    console.log('detail', monthlyDetailSchedules);
    return monthlyDetailSchedules;
  }

  async getMonthlyDiaries(schedules) {
    const monthlyDiaries = await Promise.all(
      schedules.map(async (schedule) => {
        const diary = await DiaryEntity.findExistDiaryByScheduleId(schedule);
        if (diary.title === null) {
          return false;
        }
        return true;
      }),
    );
    return monthlyDiaries;
  }

  async parseDate(Date) {
    const [year, month] = Date.split('-').map(Number);
    return { year, month };
  }
}

// async getDateRange(year, month) {
//   const endDate = new Date(year, month, 0);
//   const startDate = new Date(year, month - 1, 1);
//   return { startDate, endDate };
// }
// const dates = await this.getDateRange(
//   findMonthlyScheduleDto.year,
//   findMonthlyScheduleDto.month,
// );
// console.log(dates);
