// journey.repository.ts

import { Repository } from 'typeorm';
import { JourneyEntity } from './journey.entity';
import { CreateJourneyDto } from './journey-dto/create-journey.dto';

export class JourneyRepository {
  constructor(private readonly repository: Repository<JourneyEntity>) {}

  async createJourney(journeyInfo: CreateJourneyDto): Promise<boolean> {
    const { journeyTitle, dates } = journeyInfo;
    const journey = this.repository.create({
      journey_title: journeyTitle,
      scheduleGroups: dates.map((date) => ({ date })),
    });

    await this.repository.save(journey);

    return true;
  }
}
