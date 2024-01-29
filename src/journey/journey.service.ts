// journey.service.ts
import { Injectable } from '@nestjs/common';
import { JourneyRepository } from './journey.repository';
import { DateGroupRepository } from 'src/date/date-group.repository';
import { MonthlyJourneyRepository } from './monthly-journey.repository';

@Injectable()
export class JourneyService {
  constructor(
    private readonly journeyRepository: JourneyRepository,
    private readonly dateGroupRepository: DateGroupRepository,
    private readonly monthlyJourneyRepository: MonthlyJourneyRepository,
  ) {}

  async createJourney(
    startDate: string,
    endDate: string,
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

  async saveJourney(
    title: string,
    dateGroupId: number,
  ): Promise<{ message: string; journeyId: number }> {
    // DateGroup에서 startDate와 endDate 조회
    const dateGroup = await this.dateGroupRepository.findOne(dateGroupId);

    if (!dateGroup) {
      throw new Error('DateGroup not found');
    }

    // MonthlyJourney에서 해당 날짜의 연,월 조회
    const { year, month } = this.extractYearMonthFromDate(dateGroup.startDate);
    const monthlyJourney = await this.monthlyJourneyRepository.findOne({
      year,
      month,
    });

    if (!monthlyJourney) {
      throw new Error('MonthlyJourney not found');
    }

    // Journey 저장
    const journey = await this.journeyRepository.saveJourney(
      title,
      dateGroupId,
      monthlyJourney.id,
    );

    return {
      message: 'Journey saved successfully',
      journeyId: journey.id,
    };
  }

  async getMonthlyJourney(
    year: number,
    month: number,
  ): Promise<
    Array<{ id: number; title: string; dateGroupId: number; monthlyId: number }>
  > {
    return await this.journeyRepository.findMonthlyJourney(year, month);
  }

  private extractYearMonthFromDate(date: string): {
    year: number;
    month: number;
  } {
    const parsedDate = new Date(date);
    return {
      year: parsedDate.getFullYear(),
      month: parsedDate.getMonth() + 1, // 월은 0부터 시작하므로 +1
    };
  }
}
