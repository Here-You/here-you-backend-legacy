import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
// import { Request } from 'express';
// import { UserGuard } from 'src/user/user.guard';
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
  // @UseGuards(UserGuard)
  @Post('create')
  async createJourney(
    @Body() createJourneyDto: CreateJourneyDto,
    // @Req() req: Request,
  ) {
    // const user = req.user;
    const result = await this.journeyService.createJourney(createJourneyDto);
    return result;
  }
}
