import { Injectable } from '@nestjs/common';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { DiaryEntity } from './models/diary.entity';
import { CreateDiaryDto } from './dtos/create-diary.dto';
import { GetDiaryImgUrlDto } from './dtos/get-diary-img-url.dto';
import { AwsS3Service } from '../../aws-s3/aws-s3.service';

@Injectable()
export class DiaryService {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  //일지 작성하기
  async createDiary(scheduleId, diaryInfo: CreateDiaryDto) {
    const schedule = await ScheduleEntity.findExistSchedule(scheduleId);
    const diary = await DiaryEntity.createDiary(schedule, diaryInfo);
    console.log(diary);
    return response(BaseResponse.DIARY_CREATED);
  }
  //일지 사진 S3에 업로드 후 url 받기
  async getDiaryImgUrl(diaryId: number, getDiaryImgUrlDto: GetDiaryImgUrlDto) {
    const postImgUrl = await this.awsS3Service.getDiaryImgUrl(
      diaryId,
      getDiaryImgUrlDto,
    );
    console.log(postImgUrl);
    return response(BaseResponse.DIARY_IMG_URL_CREATED);
  }
}
