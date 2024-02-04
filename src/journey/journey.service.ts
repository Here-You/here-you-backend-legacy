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
  //여정 생성하기 - 일정, 일지 함께 생성
  async createJourney(createJourneyDto: CreateJourneyDto) {
    //여정 제목, 날짜 저장하기
    const journey = await JourneyEntity.createJourney(createJourneyDto);

    //일정 배너 생성하기
    let currentDate = new Date(createJourneyDto.startDate);
    const lastDate = new Date(createJourneyDto.endDate);

    while (currentDate <= lastDate) {
      const schedule = await ScheduleEntity.createSchedule(
        journey,
        currentDate,
      );
      //일지 생성하기
      const diary = await DiaryEntity.createDiary(schedule);
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return response(BaseResponse.JOURNEY_CREATED);
  }
}
/*const dates: CreateDateGroupDto = new CreateDateGroupDto();
    {
      (dates.startDate = createJourneyDto.startDate),
        (dates.endDate = createJourneyDto.endDate);
    }
    const dateGroup = await DateGroupEntity.createDateGroup(dates);
    if (!dateGroup) {
      throw new Error();
    }*/
