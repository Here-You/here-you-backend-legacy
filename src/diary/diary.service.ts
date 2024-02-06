import { Injectable } from '@nestjs/common';
import { response, errResponse } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { DiaryEntity } from './models/diary.entity';
import { DiaryImageEntity } from './models/diary.image.entity';
import { PostDiaryDto } from './dtos/post-diary.dto';
import { GetDiaryImgUrlDto } from './dtos/get-diary-img-url.dto';
import { S3UtilService } from 'src/utils/S3.service';
import { JourneyEntity } from 'src/journey/model/journey.entity';
import { ScheduleEntity } from 'src/schedule/schedule.entity';

@Injectable()
export class DiaryService {
  constructor(private readonly s3UtilService: S3UtilService) {}

  /*일지 작성하기*/
  async createDiary(scheduleId, diaryInfo: PostDiaryDto) {
    const diary = await DiaryEntity.createDiary(scheduleId, diaryInfo);
    console.log(diary);
    return response(BaseResponse.DIARY_CREATED);
  }

  /*일지 수정하기*/
  async updateDiary(diaryId, diaryInfo: PostDiaryDto) {
    const diary = await DiaryEntity.updateDiary(diaryId, diaryInfo);
    return response(BaseResponse.DIARY_CREATED);
  }

  /*일지 사진 S3에 업로드 후 url 받기*/
  async getDiaryImgUrl(diaryId, fileName: string) {
    const diary = await DiaryEntity.findExistDiary(diaryId);
    const imageKey = this.s3UtilService.generateRandomImageKey(fileName);
    // await this.s3UtilService.putObjectFromBase64(imageKey, fileName);
    const imageUrl = await this.s3UtilService.getImageUrl(imageKey);
    console.log('url', imageUrl);
    await DiaryImageEntity.createDiaryImg(diary, imageUrl);
    return response(BaseResponse.DIARY_IMG_URL_CREATED);
  }
}
