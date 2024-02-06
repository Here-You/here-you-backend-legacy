// journey.service.ts
import { Injectable } from '@nestjs/common';
import { JourneyEntity } from './model/journey.entity';
import { errResponse, response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { UserEntity } from 'src/user/user.entity';
import { DiaryEntity } from 'src/diary/models/diary.entity';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { CreateJourneyDto } from './dtos/create-journey.dto';
import { FindMonthlyJourneyDto } from './dtos/find-monthly-journey.dto';
import { LocationEntity } from 'src/location/location.entity';
import { DiaryImageEntity } from 'src/diary/models/diary.image.entity';

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

    return response(BaseResponse.JOURNEY_CREATED);
  }
  //지도에서 사용자의 월별 여정 불러오기
  async getMonthlyJourneyMap(userId: number, dates: FindMonthlyJourneyDto) {
    const user = await UserEntity.findExistUser(userId);
    const monthlyJourney = await this.getMonthlyJourney(user.id, dates);
    if (monthlyJourney.length === 0) {
      return errResponse(BaseResponse.JOURNEY_NOT_FOUND);
    }

    const journeyList = await Promise.all(
      monthlyJourney.map(async (journey) => {
        const schedules = await this.getMonthlySchedule(journey.id, dates);
        const diaryCount = await this.getDiaryCount(schedules);
        return {
          journeyId: journey.id,
          title: journey.title,
          startDate: journey.startDate,
          endDate: journey.endDate,
          diaryCount: diaryCount,
        };
      }),
    );
    return response(BaseResponse.GET_MONTHLY_JOURNEY_SUCCESS, journeyList);
  }

  //지도에서 여정 정보 보여주기
  async getJourneyPreview(journeyId) {
    const journey = await this.getJourneyInfo(journeyId);
    const schedules = await ScheduleEntity.findExistScheduleByJourneyId(
      journeyId,
    );
    const locationList = await this.getJourneyList(schedules);
    const journeyPreview = { journey, locationList };
    return response(BaseResponse.GET_JOURNEY_PREVIEW_SUCCESS, journeyPreview);
  }

  //journeylist
  async getJourneyList(schedules: ScheduleEntity[]) {
    const locationList = await Promise.all(
      schedules.map(async (schedule) => {
        const location = await LocationEntity.findExistLocationById(
          schedule.location,
        );
        const diary = await DiaryEntity.findExistDiaryByScheduleId(schedule);
        if (!diary) {
          return errResponse(BaseResponse.DIARY_NOT_FOUND);
        }
        const diaryImg = await DiaryImageEntity.findExistImgUrl(diary);
        if (!diaryImg) {
          return errResponse(BaseResponse.DIARY_NOT_FOUND);
        }
        return {
          date: schedule.date,
          location: {
            id: location.id,
            latitude: location.latitude,
            longitude: location.longitude,
          },
          diaryImage: {
            id: diaryImg.id,
            imageUrl: diaryImg.imageUrl,
          },
        };
      }),
    );
    return locationList;
  }

  //사용자의 월별 여정 가지고 오기
  async getMonthlyJourney(userId, dates: FindMonthlyJourneyDto) {
    const journeys = await JourneyEntity.findMonthlyJourney(userId, dates);
    return journeys;
  }

  //사용자의 월별 일정 가지고 오기
  async getMonthlySchedule(journeyId, dates: FindMonthlyJourneyDto) {
    const schedules: ScheduleEntity[] =
      await ScheduleEntity.findMonthlySchedule(journeyId, dates);
    return schedules;
  }
  //여정에 작성한 일지 개수 가지고 오기
  async getDiaryCount(schedules) {
    let diaryCount = 0;
    for (const schedule of schedules) {
      const diary = await DiaryEntity.findExistDiaryByScheduleId(schedule);
      if (diary) {
        diaryCount += 1;
      }
    }
    return diaryCount;
  }

  async getJourneyInfo(journeyId) {
    const journey = await JourneyEntity.findExistJourney(journeyId);
    return {
      id: journey.id,
      title: journey.title,
      startDate: journey.startDate,
      endDate: journey.endDate,
    };
  }
}
