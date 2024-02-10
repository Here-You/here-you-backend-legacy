import {
  Controller,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { DetailScheduleService } from './detail-schedule.service';
import { DetailContentDto } from './detail-schedule-info.dto';
import { UserGuard } from 'src/user/user.guard';

@Controller('detail-schedule')
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
  @UseGuards(UserGuard)
  @Post('create/:scheduleId')
  async createDetailSchedule(
    @Req() req: Request,
    @Param('scheduleId') scheduleId: number,
  ) {
    const result = await this.detailScheduleService.createDetailSchedule(
      scheduleId,
    );
    return result;
  }

  //세부 일정 작성하기
  @ApiOperation({
    summary: '세부 일정 작성하기',
    description: '일정 배너에 세부 일정을 작성할 수 있습니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Put('update/:detailId')
  async updateDetailSchedule(
    @Req() req: Request,
    @Param('detailId') detailId: number,
    @Body() detailContentDto: DetailContentDto,
  ) {
    const result = await this.detailScheduleService.updateDetailSchedule(
      detailId,
      detailContentDto.content,
    );
    return result;
  }

  //세부 일정 상태 업데이트
  @ApiOperation({
    summary: '세부 일정 상태 업데이트',
    description: 'true면 false로, false면 true로',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Patch('update-status/:detailId')
  async updateDetailStatus(
    @Req() req: Request,
    @Param('detailId') detailId: number,
  ) {
    const result = await this.detailScheduleService.updateDetailStatus(
      detailId,
    );
    return result;
  }

  //세부 일정 삭제하기
  /*remove로 할지, softremove로 할지 고민 */
  @ApiOperation({
    summary: '세부 일정 삭제하기',
    description: '일정 배너에 세부 일정을 삭제할 수 있습니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Delete('delete/:detailId')
  async deleteDetailSchedule(
    @Req() req: Request,
    @Param('detailId') detailId: number,
  ) {
    const result = await this.detailScheduleService.deleteDetailSchedule(
      detailId,
    );
    return result;
  }
}
