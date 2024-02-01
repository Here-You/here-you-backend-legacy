import { Body, Controller, Put, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleTitleDto } from './dtos/update-schedule-dto';
import { CreateLocationDto } from 'src/location/dtos/create-location.dto';

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
  async updateScheduleTitle(
    @Param('scheduleId') scheduleId: number,
    @Body() updateScheduleTitleDto: UpdateScheduleTitleDto,
  ) {
    const result = await this.scheduleService.updateScheduleTitle(
      scheduleId,
      updateScheduleTitleDto,
    );
    return result;
  }

  @ApiOperation({
    summary: '여정 작성하기',
    description: '위치를 태그합니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Put('update-location/:scheduleId')
  async updateScheduleLocation(
    @Param('scheduleId') scheduleId: number,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    const result = await this.scheduleService.updateScheduleLocation(
      scheduleId,
      createLocationDto,
    );
    return result;
  }
}
