import { Body, Controller, Put, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleTitleDto } from './dtos/update-schedule-dto';

@Controller('api/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({
    summary: '여정 작성하기',
    description: '제목을 작성합니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Put('update-title/:scheduleId')
  async updateSchedule(
    @Param('scheduleId') scheduleId: number,
    @Body() updateScheduleTitleDto: UpdateScheduleTitleDto,
  ) {
    const result = await this.scheduleService.updateScheduleTitle(
      scheduleId,
      updateScheduleTitleDto,
    );
    return result;
  }
}
