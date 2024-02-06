// journey.service.ts
import { Injectable } from '@nestjs/common';
import { JourneyEntity } from './model/journey.entity';
import { errResponse, response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { CreateJourneyDto } from './dtos/create-journey.dto';

@Injectable()
export class JourneyService {
  //여정 생성하기 - 일정, 일지 함께 생성
  async createJourney(user, createJourneyDto: CreateJourneyDto) {
    //여정 제목, 날짜 저장하기
    const journey = await JourneyEntity.createJourney(user, createJourneyDto);

    //일정 배너 생성하기 : (startDate - endDate + 1)개
    let currentDate = new Date(createJourneyDto.startDate);
    const lastDate = new Date(createJourneyDto.endDate);

    while (currentDate <= lastDate) {
      const schedule = await ScheduleEntity.createSchedule(
        journey,
        currentDate,
      );
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return errResponse(BaseResponse.JOURNEY_CREATED);
  }
}
