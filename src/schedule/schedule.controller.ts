import {
  Body,
  Controller,
  Put,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleDto } from './dtos/update-schedule-dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({
    summary: '여정 작성하기',
    description: '제목과 위치를 작성합니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Put('update/:scheduleId')
  async updateSchedule(
    @Param('scheduleId') scheduleId: number,
    @Body() body: UpdateScheduleDto,
  ) {
    const result = await this.scheduleService.updateSchedule(scheduleId, body);
    return result;
  }
}
