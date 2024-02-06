import {
  Controller,
  Param,
  Body,
  Req,
  UseGuards,
  Get,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { UserGuard } from 'src/user/user.guard';
import { JourneyService } from './journey.service';
import { CreateJourneyDto } from './dtos/create-journey.dto';
import { FindMonthlyJourneyDto } from './dtos/find-monthly-journey.dto';

@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}
  /*여정 저장하기*/
  @ApiOperation({
    summary: '여정 저장하기',
    description: '날짜와 제목을 포함합니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Post('create')
  async createJourney(
    @Body() createJourneyDto: CreateJourneyDto,
    @Req() req: Request,
  ) {
    const result = await this.journeyService.createJourney(
      req.user,
      createJourneyDto,
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
  @Get(':journeyId')
  async getJourneyPreview(@Param('journeyId') journeyId: number) {
    const result = await this.journeyService.getJourneyPreview(journeyId);
    return result;
  }

  /*월별 여정 불러오기*/
  @ApiOperation({
    summary: '월별 여정 불러오기',
    description: '월별 여정 리스트 - 제목, 날짜, 일지 개수를 불러옵니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Get('monthly/:year/:month')
  async getMonthlyJourney(
    @Param('year') year: number,
    @Param('month') month: number,
    @Req() req: Request,
  ) {
    const user = req.user;
    const findMonthlyJourneyDto: FindMonthlyJourneyDto = {
      year,
      month,
    };
    const result = await this.journeyService.getMonthlyJourneyMap(
      user.id,
      findMonthlyJourneyDto,
    );
    return result;
  }
}
