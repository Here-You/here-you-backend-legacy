// DateGroup.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { DateGroupService } from './date-group.service';
import { CreateJourneyDto } from '../journey/dtos/create-journey.dto';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class DateGroupController {
  constructor(private readonly dateGroupService: DateGroupService) {}

  @ApiOperation({
    summary: '날짜 그룹 생성하기',
    description: 'startDate와 endDate 저장',
  })
  @ApiOkResponse({
    description: '날짜 그룹 생성 성공',
  })
  @Post('/api/post/create-date-group')
  createDateGroup(@Body() createJourneyDto: CreateJourneyDto) {
    const result = this.dateGroupService.createDateGroup(createJourneyDto);
    return result;
  }
}
