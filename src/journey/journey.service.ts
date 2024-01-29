// journey.service.ts
import { Injectable } from '@nestjs/common';
import { JourneyRepository } from './journey.repository';
import { CreateJourneyDto } from './journey-dto/create-journey.dto';

@Injectable()
export class JourneyService {
  constructor(private readonly journeyRepository: JourneyRepository) {}
}
