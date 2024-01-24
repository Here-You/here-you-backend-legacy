import { Injectable } from '@nestjs/common';
import { JourneyRepository } from './journey.repository';
import { CreateJourneyDto } from './journey-dto/create-journey.dto';

@Injectable()
export class JourneyService {
  constructor(private readonly journeyRepository: JourneyRepository) {}

  async createJourney(journeyInfo: CreateJourneyDto): Promise<boolean> {
    const journey = await this.journeyRepository.createJourney({
      journeyTitle: journeyInfo.journeyTitle,
      dates: journeyInfo.dates,
    });
    console.log(journey);
    return true;
  }
}
