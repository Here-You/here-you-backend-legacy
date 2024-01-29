// journey.service.ts
import { Injectable } from '@nestjs/common';
import { JourneyRepository } from './journey.repository';
import { DateGroupRepository } from 'src/date-group/date-group.repository';
import { MonthlyJourneyRepository } from './monthly-journey.repository';

@Injectable()
export class JourneyService {
  constructor(
    private readonly journeyRepository: JourneyRepository,
    private readonly dateGroupRepository: DateGroupRepository,
    private readonly monthlyJourneyRepository: MonthlyJourneyRepository,
  ) {}
}
