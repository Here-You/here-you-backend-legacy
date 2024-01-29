// journey.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { MESSAGE } from '../constants/response';
import { JourneyRepository } from './journey.repository';
import { DateGroupRepository } from 'src/date/date-group.repository';
import { MonthlyJourneyRepository } from './monthly-journey.repository';
import { CreateJourneyDto } from './dtos/create-journey.dto';

@Injectable()
export class JourneyService {
  constructor(
    private readonly journeyRepository: JourneyRepository,
    private readonly dateGroupRepository: DateGroupRepository,
    private readonly monthlyJourneyRepository: MonthlyJourneyRepository,
  ) {}

  async createJourney(
    createJourneyDto: CreateJourneyDto,
  ): Promise<{ message: string; dateGroupId: number }> {
    // DateGroup 생성
    const dateGroup = await this.dateGroupRepository.createDateGroup(
      startDate,
      endDate,
    );

    return {
      message: 'Journey created successfully',
      dateGroupId: dateGroup.id,
    };
  }
}
