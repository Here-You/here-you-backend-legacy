// journey.service.ts
import { Injectable } from '@nestjs/common';
import { JourneyEntity } from './model/journey.entity';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { DateGroupEntity } from 'src/date-group/date-group.entity';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { CreateJourneyDto } from './dtos/create-journey.dto';
import { CreateDateGroupDto } from 'src/date-group/dtos/create-date-group.dto';
import { DiaryEntity } from 'src/diary/models/diary.entity';

@Injectable()
export class JourneyService {
  async createJourney(createJourneyDto: CreateJourneyDto) {
    const dates: CreateDateGroupDto = new CreateDateGroupDto();
    {
      (dates.startDate = createJourneyDto.startDate),
        (dates.endDate = createJourneyDto.endDate);
    }
    const dateGroup = await DateGroupEntity.createDateGroup(dates);
    if (!dateGroup) {
      throw new Error();
    }
    const journey = await JourneyEntity.createJourney(
      createJourneyDto,
      dateGroup.id,
    );

    // let schedule = await ScheduleEntity.createSchedule(dates);
    let currentDate = new Date(dates.startDate);
    const lastDate = new Date(dates.endDate);

    while (currentDate <= lastDate) {
      const schedule = await ScheduleEntity.createSchedule(currentDate);
      const diary = await DiaryEntity.preDiary(schedule);
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return response(BaseResponse.JOURNEY_CREATED);
  }
}
