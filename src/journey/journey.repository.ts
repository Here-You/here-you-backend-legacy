import { Repository } from 'typeorm';
import { JourneyEntity } from './journey.entity';
import { CreateJourneyDto } from './journey-dto/create-journey.dto';

export class JourneyRepository {
  constructor(private readonly repository: Repository<JourneyEntity>) {}

  async createJourney(
    createJourneyDto: CreateJourneyDto,
  ): Promise<JourneyEntity> {
    const { journeyTitle, dates } = createJourneyDto;

    const journey = this.repository.create({
      journey_title: journeyTitle,
      //   scheduleGroups: dates.map((date) => ({ scheduleGroups: date })),
      scheduleGroups: dates.map((date) => ({ date })),
    });

    await this.repository.save(journey);
    return journey;
  }
}
