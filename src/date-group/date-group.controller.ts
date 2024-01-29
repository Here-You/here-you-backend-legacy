// DateGroup.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { DateGroupService } from './date-group.service';
import { CreateJourneyDto } from '../journey/dtos/create-journey.dto';

@Controller()
export class DateGroupController {
  constructor(private readonly dateGroupService: DateGroupService) {}

  @Post('/api/post/create-date-group')
  createDateGroup(@Body('createDateGroup') dates: CreateJourneyDto) {
    return this.dateGroupService.createDateGroup(dates);
  }
}
