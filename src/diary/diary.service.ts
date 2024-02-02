import { Injectable } from '@nestjs/common';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { DiaryEntity } from './models/diary.entity';
import { CreateDiaryDto } from './dtos/create-diary.dto';

@Injectable()
export class DiaryService {
  async createDiary(scheduleId, diaryInfo: CreateDiaryDto) {
    const schedule = await ScheduleEntity.findExistSchedule(scheduleId);
    const diary = await DiaryEntity.createDiary(schedule, diaryInfo);
    console.log(diary);
    return response(BaseResponse.DIARY_CREATED);
  }
}
