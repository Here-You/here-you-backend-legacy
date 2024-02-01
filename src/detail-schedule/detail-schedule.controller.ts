import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DetailScheduleService } from './detail-schedule.service';

@Controller('api/detail-schedule')
export class DetailScheduleController {
  constructor(private readonly detailScheduleService: DetailScheduleService) {}

  //세부일정 추가하기
  @ApiOperation({
    summary: '세부 일정 추가하기',
    description: '일정 배너에서 세부 일정을 추가할 수 있습니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Post('create/:scheduleId')
  async createDetailSchedule(@Param('scheduleId') scheduleId: number) {
    const result = await this.detailScheduleService.createDetailSchedule(
      scheduleId,
    );
    return result;
  }
}
