// journey.module.ts
import { Module } from '@nestjs/common';
import { MonthlyJourneyRepository } from './monthly-journey.repository';

@Module({
  providers: [MonthlyJourneyRepository],
})
export class JourneyModule {}
