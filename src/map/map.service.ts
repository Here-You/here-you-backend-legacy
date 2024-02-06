import { Injectable } from '@nestjs/common';
import { JourneyEntity } from '../journey/model/journey.entity';
import { errResponse, response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { UserEntity } from 'src/user/user.entity';
import { DiaryEntity } from 'src/diary/models/diary.entity';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { MonthInfoDto } from './month-info.dto';
import { LocationEntity } from 'src/location/location.entity';
import { DiaryImageEntity } from 'src/diary/models/diary.image.entity';

@Injectable()
export class MapService {
  //지도에서 사용자의 월별 여정 불러오기
  async getMonthlyJourneyMap(userId: number, monthInfoDto: MonthInfoDto) {
    const user = await UserEntity.findExistUser(userId);
    const monthlyJourney = await this.getMonthlyJourney(user.id, monthInfoDto);
    if (monthlyJourney.length === 0) {
      return errResponse(BaseResponse.JOURNEY_NOT_FOUND);
    }

    const journeyList = await Promise.all(
      monthlyJourney.map(async (journey) => {
        const schedules = await this.getMonthlySchedule(
          journey.id,
          monthInfoDto,
        );
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
          return null;
        }
        const diaryImg = await DiaryImageEntity.findExistImgUrl(diary);
        if (!diaryImg) {
          return null;
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
  async getMonthlyJourney(userId, monthInfoDto: MonthInfoDto) {
    const journeys = await JourneyEntity.findMonthlyJourney(
      userId,
      monthInfoDto,
    );
    return journeys;
  }

  //사용자의 월별 일정 가지고 오기
  async getMonthlySchedule(journeyId, monthInfoDto: MonthInfoDto) {
    const schedules: ScheduleEntity[] =
      await ScheduleEntity.findMonthlySchedule(journeyId, monthInfoDto);
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

  /*일지 불러오기 - 지도*/
  async getDiaryList(journeyId) {
    const journey = await JourneyEntity.findExistJourney(journeyId);
    const schedules = await ScheduleEntity.findExistScheduleByJourneyId(
      journey.id,
    );
    const diaryList = await Promise.all(
      schedules.map(async (schedule) => {
        const diary = await DiaryEntity.findExistDiaryByScheduleId(schedule);
        if (!diary) {
          return null;
        }
        const diaryImg = await DiaryImageEntity.findExistImgUrl(diary);
        if (!diaryImg) {
          return null;
        }
        return {
          journeyId: journeyId,
          date: schedule.date,
          diary: diary,
          diaryImage: {
            id: diaryImg.id,
            imageUrl: diaryImg.imageUrl,
          },
        };
      }),
    );
    return response(BaseResponse.GET_DIARY_SUCCESS, diaryList);
  }
}
