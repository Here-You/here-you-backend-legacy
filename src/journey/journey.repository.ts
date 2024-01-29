// journey.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JourneyEntity } from './journey.entity';

@Injectable()
export class JourneyRepository {
  constructor(
    @InjectRepository(JourneyEntity)
    private readonly journey: Repository<JourneyEntity>,
  ) {}
}
