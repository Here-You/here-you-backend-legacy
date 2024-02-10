import { Injectable } from '@nestjs/common';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { DetailScheduleEntity } from './detail-schedule.entity';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { DetailContentDto } from './detail-schedule-info.dto';

@Injectable()
export class DetailScheduleService {
  //세부일정 추가하기
  async createDetailSchedule(scheduleId: number, content: DetailContentDto) {
    const schedule = await ScheduleEntity.findExistSchedule(scheduleId);
    console.log(schedule.id);
    const detailSchedule = await DetailScheduleEntity.createDetailSchedule(
      schedule,
      content,
    );
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

  //세부일정 상태 업데이트하기
  async updateDetailStatus(detailId) {
    const detailSchedule = await DetailScheduleEntity.findExistDetail(detailId);
    const updateStatus = await DetailScheduleEntity.updateDetailStatus(
      detailSchedule,
    );
    console.log(updateStatus);
    return response(
      BaseResponse.UPDATE_DETAIL_SCHEDULE_STATUS_SUCCESS,
      updateStatus.isDone,
    );
  }

  //세부일정 삭제하기
  async deleteDetailSchedule(detailId: number) {
    const detailSchedule = await DetailScheduleEntity.findExistDetail(detailId);
    const deleteDetailSchedule =
      await DetailScheduleEntity.deleteDetailSchedule(detailSchedule);
    return response(BaseResponse.DELETE_DETAIL_SCHEDULE_SUCCESS);
  }
}
