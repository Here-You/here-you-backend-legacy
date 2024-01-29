// journey.service.ts
import { Injectable } from '@nestjs/common';
import { JourneyRepository } from './journey.repository';

@Injectable()
export class JourneyService {
  constructor(private readonly journeyRepository: JourneyRepository) {}
}
