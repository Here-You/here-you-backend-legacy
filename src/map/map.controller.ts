import { MapService } from './map.service';
import { Controller, Param, Req, UseGuards, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { UserGuard } from 'src/user/user.guard';
import { MonthInfoDto } from './month-info.dto';
import { CursorBasedPaginationRequestDto } from './cursor-based-pagination-request.dto.ts';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  /*월별 여정 불러오기*/
  @ApiOperation({
    summary: '월별 여정 불러오기',
    description: '월별 여정 리스트 - 제목, 날짜, 일지 개수를 불러옵니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Get('get-monthly-journey/:year/:month')
  async getMonthlyJourney(
    @Param('year') year: number,
    @Param('month') month: number,
    @Req() req: Request,
  ) {
    const user = req.user;
    const monthInfoDto: MonthInfoDto = {
      year,
      month,
    };
    const result = await this.mapService.getMonthlyJourneyMap(
      user.id,
      monthInfoDto,
    );
    return result;
  }
  /*월별 일정 불러오기 -캘린더 */
  @ApiOperation({
    summary: '월별 일정 불러오기',
    description:
      '여정에 포함되는 일정, 위치, 세부 일정, 다이어리 유무를 불러옵니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Get('get-monthly-schedule/:date')
  async getMonthlySchedule(
    @Param('date') date: Date,
    @Query() options: CursorBasedPaginationRequestDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    const result = await this.mapService.getMonthlySchedules(
      user.id,
      date,
      options,
    );
    return result;
  }

  /*여정 불러오기*/
  @ApiOperation({
    summary: '여정 불러오기',
    description: '여정 제목, 날짜, 위치, 사진을 불러옵니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Get('get-journey/:journeyId')
  async getJourneyPreview(
    @Req() req: Request,
    @Param('journeyId') journeyId: number,
  ) {
    const user = req.user;
    const result = await this.mapService.getJourneyPreview(user.id, journeyId);
    return result;
  }

  /*일지 불러오기 - 지도 */
  @ApiOperation({
    summary: '일지 불러오기 - 지도',
    description: 'journeyId로 일지 불러오기',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Get('get-diaries/:journeyId')
  async getDiaryList(
    @Req() req: Request,
    @Param('journeyId') journeyId: number,
  ) {
    const user = req.user;
    const result = await this.mapService.getDiaryList(user.id, journeyId);
    return result;
  }

  /*세부 여정 불러오기 - 지도 */
  @ApiOperation({
    summary: '세부 여정 불러오기 - 지도',
    description: 'journeyId로 일정 불러오기',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Get('get-schedules/:journeyId')
  async getDetailJourneyList(
    @Req() req: Request,
    @Param('journeyId') journeyId: number,
  ) {
    const user = req.user;
    const result = await this.mapService.getDetailJourneyList(
      user.id,
      journeyId,
    );
    return result;
  }
}
