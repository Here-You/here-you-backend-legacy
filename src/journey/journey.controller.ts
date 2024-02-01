import { Controller, Post, Body } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateJourneyDto } from './dtos/create-journey.dto';

@Controller('api/journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}
  @ApiOperation({
    summary: '여정 저장하기',
    description: '날짜와 제목을 포함합니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Post('create')
  async createJourney(@Body() createJourneyDto: CreateJourneyDto) {
    const result = await this.journeyService.createJourney(createJourneyDto);
    return result;
  }
}
