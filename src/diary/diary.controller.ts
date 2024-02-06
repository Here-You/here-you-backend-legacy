import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Controller, Put, Post, Get, Body, Param } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { PostDiaryDto } from './dtos/post-diary.dto';
import { GetDiaryImgUrlDto } from './dtos/get-diary-img-url.dto';

@Controller('diary')
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
  @Post('create/:scheduleId')
  async postJourney(
    @Param('scheduleId') scheduleId: number,
    @Body() body: PostDiaryDto,
  ) {
    const result = await this.diaryService.createDiary(scheduleId, body);
    return result;
  }

  /*일지 수정하기 */
  @ApiOperation({
    summary: '일지 수정하기',
    description: '일지를 작성 후 확인하기에서 바로 수정 가능',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Put('update/:diaryId')
  async updateJourney(
    @Param('diaryId') diaryId: number,
    @Body() body: PostDiaryDto,
  ) {
    const result = await this.diaryService.updateDiary(diaryId, body);
    return result;
  }

  /*일지 사진 url 발급 */
  /*일지 사진 업로드*/
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
    @Body('fileName') fileName: string,
  ) {
    const result = await this.diaryService.getDiaryImgUrl(diaryId, fileName);
    return result;
  }
}
