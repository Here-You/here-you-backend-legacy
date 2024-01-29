// journey.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { JourneyService } from './journey.service';

@Controller('api/journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}
}
