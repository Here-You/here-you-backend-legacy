import { Injectable } from '@nestjs/common';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { DetailScheduleEntity } from './detail-schedule.entity';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';

@Injectable()
export class DetailScheduleService {
  //세부일정 추가하기
  async createDetailSchedule(scheduleId: number) {
    const schedule = await ScheduleEntity.findExistSchedule(scheduleId);
    console.log(schedule.id);
    const detailSchedule = await DetailScheduleEntity.createDetailSchedule(
      schedule.id,
    );
    console.log(detailSchedule);
    return response(BaseResponse.DETAIL_SCHEDULE_CREATED);
  }

  //세부일정 작성하기
  async updateDetailSchedule(detailId, content) {
    const detailSchedule = await DetailScheduleEntity.findExistDetail(detailId);
    const updateContent = await DetailScheduleEntity.updateDetailSchedule(
      detailSchedule,
      content,
    );
    console.log(updateContent);
    return response(BaseResponse.DETAIL_SCHEDULE_UPDATED);
  }
}
