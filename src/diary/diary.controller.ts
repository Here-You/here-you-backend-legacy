import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Controller, Put, Post, Get, Body, Param } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { PostDiaryDto } from './dtos/post-diary.dto';

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
  async updateDiary(
    @Param('diaryId') diaryId: number,
    @Body() body: PostDiaryDto,
  ) {
    const result = await this.diaryService.updateDiary(diaryId, body);
    return result;
  }

  /*일지 불러오기-캘린더*/
  @ApiOperation({
    summary: '일지 불러오기 - 캘린더 ',
    description: '일지가 존재하는 경우 id,date,내용',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Get('get/:scheduleId')
  async getDiary(@Param('scheduleId') scheduleId: number) {
    const result = await this.diaryService.getDiary(scheduleId);
    return result;
  }
}
