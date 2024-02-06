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
import { Request } from 'express';
import { UserGuard } from 'src/user/user.guard';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleDto } from './dtos/update-schedule-dto';
import { FindMonthlyScheduleDto } from './dtos/find-monthly-schedule.dto';

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

  @ApiOperation({
    summary: '홈 화면 - 캘린더',
    description: '월별 일정을 불러옵니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Get(':year/:month')
  async getMonthlySchedule(
    @Param('year') year: number,
    @Param('month') month: number,
    @Req() req: Request,
  ) {
    const user = req.user;
    console.log(user.id);
    const findMonthlyScheduleDto: FindMonthlyScheduleDto = {
      year,
      month,
    };
    console.log('dto', findMonthlyScheduleDto);
    const result = await this.scheduleService.getMonthlyCalender(
      user.id,
      findMonthlyScheduleDto,
    );

    return result;
  }
}
