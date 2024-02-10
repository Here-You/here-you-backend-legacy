import { Body, Controller, Put, Param, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { UserGuard } from 'src/user/user.guard';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleDto } from './dtos/update-schedule-dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({
    summary: '일정 작성하기',
    description: '제목과 위치를 작성합니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Put('update/:scheduleId')
  async updateSchedule(
    @Req() req: Request,
    @Param('scheduleId') scheduleId: number,
    @Body() body: UpdateScheduleDto,
  ) {
    const result = await this.scheduleService.updateSchedule(scheduleId, body);
    return result;
  }

  @ApiOperation({
    summary: '일정 삭제하기',
    description: '제목과 위치를 삭제합니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Put('reset/:scheduleId')
  async deleteSchedule(
    @Param('scheduleId') scheduleId: number,
    @Req() req: Request,
  ) {
    const user = req.user;
    const result = await this.scheduleService.resetSchedule(user, scheduleId);
    return result;
  }
}
