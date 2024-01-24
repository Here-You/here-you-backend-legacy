// journey.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { CreateJourneyDto } from './journey-dto/create-journey.dto';

@Controller('api/journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Post('create')
  async createJourney(@Body() journeyInfo: CreateJourneyDto): Promise<boolean> {
    const result = await this.journeyService.createJourney(journeyInfo);
    return result;
  }
}
