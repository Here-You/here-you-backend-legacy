// journey.module.ts
import { Module } from '@nestjs/common';
import { JourneyController } from './journey.controller';
import { JourneyService } from './journey.service';
import { JourneyRepository } from './journey.repository';

@Module({
  controllers: [JourneyController],
  providers: [JourneyService, JourneyRepository],
})
export class JourneyModule {}
