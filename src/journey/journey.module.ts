// journey.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JourneyController } from './journey.controller';
import { JourneyService } from './journey.service';
import { JourneyRepository } from './journey.repository';
import { JourneyEntity } from './journey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JourneyEntity])],
  controllers: [JourneyController],
  providers: [JourneyService, JourneyRepository],
})
export class JourneyModule {}
