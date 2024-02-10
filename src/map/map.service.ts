import { Injectable, NotFoundException } from '@nestjs/common';
import { JourneyEntity } from '../journey/model/journey.entity';
import { errResponse, response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { UserEntity } from 'src/user/user.entity';
import { DiaryEntity } from 'src/diary/models/diary.entity';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { MonthInfoDto } from './month-info.dto';
import { LocationEntity } from 'src/location/location.entity';
import { DiaryImageEntity } from 'src/diary/models/diary.image.entity';
import { DetailScheduleEntity } from 'src/detail-schedule/detail-schedule.entity';
import { CursorBasedPaginationRequestDto } from './cursor-based-pagination-request.dto.ts';

@Injectable()
export class MapService {
  /*캘린더에서 사용자의 월별 일정 불러오기*/
  async getMonthlySchedules(
    userId: number,
    date: Date,
    options: CursorBasedPaginationRequestDto,
  ) {
    const user = await UserEntity.findExistUser(userId);
    const journeys = await JourneyEntity.findExistJourneyByDate(user.id, date);

    // 커서 값에 해당하는 배너들을 가져옴
    const paginatedJourneys = journeys.slice(
      options.cursor,
      options.cursor + options.pageSize,
    );
    if (paginatedJourneys.length === 0) {
      return {
        data: response(BaseResponse.SCHEDULE_NOT_FOUND, { nextCursor: null }),
      };
    }
    const result = await Promise.all(
      paginatedJourneys.map(async (journey) => {
        const schedules = await ScheduleEntity.findExistScheduleByJourneyId(
          journey.id,
        );
        const scheduleList = await Promise.all(
          schedules.map(async (schedule) => {
            const locations = await this.getLocationList([schedule]); // getLocationList에 schedule 배열을 전달
            const detailSchedules = await this.getDetailScheduleList([
              schedule,
            ]); // getDetailScheduleList에 schedule 배열을 전달
            const diary = await this.getDiaryStatus([schedule]); // getDiaryStatus에 schedule 배열을 전달

            return {
              scheduleId: schedule.id,
              title: schedule.title,
              date: schedule.date,
              location: locations,
              detailSchedules: detailSchedules,
              diary: diary,
            };
          }),
        );

        return {
          journeyId: journey.id,
          startDate: journey.startDate,
          endDate: journey.endDate,
          scheduleList: scheduleList,
        };
      }),
    );
    // 다음 페이지를 위한 커서 값 계산
    const nextCursor = Number(options.cursor) + Number(options.pageSize);

    return {
      data: response(BaseResponse.GET_SCHEDULE_SUCCESS, result),
      nextCursor: nextCursor,
    };
  }

  /*지도에서 사용자의 월별 여정 불러오기*/
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
        console.log(schedules);
        const locations = await this.getLocationList(schedules);
        const images = await this.getDiaryImageList(schedules);
        const mapInfo = schedules.map((schedule, index) => {
          return {
            date: schedules[index].date,
            location: locations[index],
            diaryImage: images[index],
          };
        });
        const diaryCount = await this.getDiaryCount(schedules);
        return {
          journeyId: journey.id,
          title: journey.title,
          startDate: journey.startDate,
          endDate: journey.endDate,
          map: mapInfo,
          diaryCount: diaryCount,
        };
      }),
    );
    return response(BaseResponse.GET_MONTHLY_JOURNEY_SUCCESS, journeyList);
  }

  /*지도에서 여정 정보 보여주기*/
  async getJourneyPreview(journeyId) {
    const journey = await this.getJourneyInfo(journeyId);
    const schedules = await ScheduleEntity.findExistScheduleByJourneyId(
      journeyId,
    );
    const locationList = await this.getLocationList(schedules);
    const imageList = await this.getDiaryImageList(schedules);
    const scheduleList = schedules.map((schedule, index) => {
      return {
        location: locationList[index],
        diaryImage: imageList[index],
      };
    });

    return response(BaseResponse.GET_JOURNEY_PREVIEW_SUCCESS, {
      journey: {
        journeyId: journey.id,
        title: journey.title,
        startDate: journey.startDate,
        endDate: journey.endDate,
      },
      scheduleList,
    });
  }

  /*작성한 일지 불러오기 - 지도*/
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

  /* 지도에서 세부 여정 확인하기 */
  async getDetailJourneyList(journeyId) {
    const journey = await this.getJourneyInfo(journeyId);
    const schedules = await ScheduleEntity.findExistScheduleByJourneyId(
      journey.id,
    );
    const scheduleInfoList = await this.getScheduleList(schedules);
    const locationList = await this.getLocationList(schedules);
    const imageList = await this.getDiaryImageList(schedules);
    const diaryStatus = await this.getDiaryStatus(schedules);
    const detailJourneyList = schedules.map((schedule, index) => {
      return {
        schedule: scheduleInfoList[index],
        location: locationList[index],
        diaryImage: imageList[index],
        diary: diaryStatus[index],
      };
    });
    return response(BaseResponse.GET_SCHEDULE_SUCCESS, detailJourneyList);
  }

  //일정 정보 불러오기
  async getScheduleList(schedules: ScheduleEntity[]) {
    const scheduleInfoList = await Promise.all(
      schedules.map(async (schedule) => {
        const scheduleInfo = await ScheduleEntity.findExistSchedule(
          schedule.id,
        );
        return {
          scheduleId: scheduleInfo.id,
          title: scheduleInfo.title,
          date: scheduleInfo.date,
        };
      }),
    );
    return scheduleInfoList;
  }

  //위치 정보 불러오기
  async getLocationList(schedules: ScheduleEntity[]) {
    const locationList = await Promise.all(
      schedules.map(async (schedule) => {
        const location = await ScheduleEntity.findExistLocation(schedule.id);
        console.log(location);
        if (!location) {
          return { location: null };
        }
        return {
          locationId: location.id,
          latitude: location.latitude,
          longitude: location.longitude,
        };
      }),
    );
    return locationList;
  }

  //이미지 리스트 불러오기
  async getDiaryImageList(schedules: ScheduleEntity[]) {
    const diaryImageList = await Promise.all(
      schedules.map(async (schedule) => {
        const diary = await DiaryEntity.findExistDiaryByScheduleId(schedule);
        if (!diary) {
          return null;
        }
        const diaryImage = await DiaryImageEntity.findExistImgUrl(diary);
        return {
          imageId: diaryImage.id,
          imageUrl: diaryImage.imageUrl,
        };
      }),
    );
    return diaryImageList;
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
  async getMonthlySchedule(
    journeyId,
    monthInfoDto: MonthInfoDto,
  ): Promise<ScheduleEntity[]> {
    const schedules: ScheduleEntity[] =
      await ScheduleEntity.findMonthlySchedule(journeyId, monthInfoDto);
    return schedules;
  }

  // 사용자의 세부 일정 가지고 오기
  async getDetailScheduleList(schedules: ScheduleEntity[]) {
    const detailScheduleList = await Promise.all(
      schedules.map(async (schedule) => {
        const detailSchedules =
          await DetailScheduleEntity.findExistDetailByScheduleId(schedule);
        return detailSchedules;
      }),
    );
    return detailScheduleList;
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

  //일지 작성 여부 가져오기
  async getDiaryStatus(schedules) {
    const diaryStatusList = await Promise.all(
      schedules.map(async (schedule) => {
        const diary = await DiaryEntity.findExistDiaryByScheduleId(schedule);
        if (!diary) {
          return false;
        }
        return true;
      }),
    );

    return diaryStatusList;
  }

  //여정 정보 불러오기
  async getJourneyInfo(journeyId) {
    const journey = await JourneyEntity.findExistJourney(journeyId);
    if (!journey) {
      throw new NotFoundException(BaseResponse.JOURNEY_NOT_FOUND);
    }
    return {
      id: journey.id,
      title: journey.title,
      startDate: journey.startDate,
      endDate: journey.endDate,
    };
  }
}

// const scheduleList = await Promise.all(
//   journeys.map(async (journey) => {
//     const schedules = await ScheduleEntity.findExistScheduleByJourneyId(
//       journey.id,
//     );
//     if (!schedules) {
//       return errResponse(BaseResponse.SCHEDULE_NOT_FOUND);
//     }
//     const locations = await this.getLocationList(schedules);
//     const detailSchedules = await this.getDetailScheduleList(schedules);
//     const diary = await this.getDiaryStatus(schedules);
//   }),
// );
