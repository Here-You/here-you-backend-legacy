import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Controller, Post, Body, Param } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dtos/create-diary.dto';
import { GetDiaryImgUrlDto } from './dtos/get-diary-img-url.dto';

@Controller('api/diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  /*일지 작성하기 */
  @ApiOperation({
    summary: '일지 작성하기',
    description: '일지를 작성하고 저장한 상태',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Post('create/:diaryId')
  async createJourney(
    @Param('diaryId') diaryId: number,
    @Body() body: CreateDiaryDto,
  ) {
    const result = await this.diaryService.createDiary(diaryId, body);
    return result;
  }
  /*일지 사진 url 발급 */
  @ApiOperation({
    summary: '일지 사진 업로드 위한 presigned Url 발급',
    description: '일지를 작성하고 저장한 상태',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Post('image-url/:diaryId')
  async getDiaryImageUrl(
    @Param('diaryId') diaryId: number,
    @Body() body: GetDiaryImgUrlDto,
  ) {
    const result = await this.diaryService.getDiaryImgUrl(diaryId, body);
    return result;
  }
}
