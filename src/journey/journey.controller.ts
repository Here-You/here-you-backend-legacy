import {
  Controller,
  Body,
  Req,
  UseGuards,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { UserGuard } from 'src/user/user.guard';
import { JourneyService } from './journey.service';
import { CreateJourneyDto } from './dtos/create-journey.dto';

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

  /*여정 저장하기*/
  @ApiOperation({
    summary: '여정 삭제하기',
    description:
      '여정을 삭제할때 일정, 세부일정, 일지, 사진을 모두 삭제합니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Delete('delete/:journeyId')
  async deleteJourney(
    @Param('journeyId') journeyId: number,
    @Req() req: Request,
  ) {
    const result = await this.journeyService.deleteJourney(journeyId);
    return result;
  }
}
