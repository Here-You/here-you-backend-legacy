// journey.service.ts
import { Injectable } from '@nestjs/common';
import { JourneyEntity } from './model/journey.entity';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { CreateJourneyDto } from './dtos/create-journey.dto';
import { DiaryEntity } from 'src/diary/models/diary.entity';

@Injectable()
export class JourneyService {
  async createJourney(createJourneyDto: CreateJourneyDto) {
    /*const dates: CreateDateGroupDto = new CreateDateGroupDto();
    {
      (dates.startDate = createJourneyDto.startDate),
        (dates.endDate = createJourneyDto.endDate);
    }
    const dateGroup = await DateGroupEntity.createDateGroup(dates);
    if (!dateGroup) {
      throw new Error();
    }*/

    const journey = await JourneyEntity.createJourney(createJourneyDto);

    // let schedule = await ScheduleEntity.createSchedule(dates);
    let currentDate = new Date(createJourneyDto.startDate);
    const lastDate = new Date(createJourneyDto.endDate);

    while (currentDate <= lastDate) {
      const schedule = await ScheduleEntity.createSchedule(
        journey,
        currentDate,
      );
      const diary = await DiaryEntity.createDiary(journey, schedule);
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return response(BaseResponse.JOURNEY_CREATED);
  }
}
