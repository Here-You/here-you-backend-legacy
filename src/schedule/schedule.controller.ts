import { Body, Controller, Put, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleDto } from './dtos/update-schedule-dto';

@Controller('api/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({
    summary: '여정 작성하기',
    description: '제목, 위치를 작성합니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Put('update/:scheduleId')
  async updateSchedule(
    @Param('scheduleId') scheduleId: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const result = await this.scheduleService.updateSchedule(
      scheduleId,
      updateScheduleDto,
    );
    return result;
  }
}
