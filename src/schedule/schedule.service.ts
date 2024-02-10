import { Injectable, NotFoundException } from '@nestjs/common';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { LocationEntity } from 'src/location/location.entity';
import { ScheduleEntity } from './schedule.entity';
import { UserEntity } from 'src/user/user.entity';
import { UpdateScheduleDto } from './dtos/update-schedule-dto';
import { JourneyEntity } from 'src/journey/model/journey.entity';

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
        schedule.location,
        updateScheduleDto,
      );
      console.log(location);
    } else {
      const location = await LocationEntity.createLocation(updateScheduleDto);
      await ScheduleEntity.updateScheduleLocation(schedule, location);
      console.log(location);
    }
  }

  async resetSchedule(user, scheduleId) {
    const existUser = await UserEntity.findExistUser(user.id);
    const schedule = await ScheduleEntity.findExistSchedule(scheduleId);

    // 스케줄이 위치를 가지고 있는지 확인
    if (schedule.location) {
      // 해당 위치가 다른 스케줄에서 사용되고 있는지 확인
      const existLocation = await ScheduleEntity.findExistLocations(
        schedule.location,
      );
      console.log(existLocation);
      if (!existLocation) {
        // 다른 스케줄에서 사용되고 있지 않으면 해당 위치 삭제
        console.log('삭제할', schedule.location);
        await LocationEntity.deleteLocation(schedule.location);
      }
    }

    // 스케줄 초기화
    await ScheduleEntity.resetSchedule(schedule);
    return response(BaseResponse.DELETE_SCHEDULE_SUCCESS);
  }
}
