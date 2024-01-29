// journey.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyJourneyEntity } from './model/monthly-journey.entity';

@Injectable()
export class MonthlyJourneyRepository {
  constructor(
    @InjectRepository(MonthlyJourneyEntity)
    private readonly monthlyJourney: Repository<MonthlyJourneyEntity>,
  ) {}
}
