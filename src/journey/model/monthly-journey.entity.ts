// monthly-journey.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { JourneyEntity } from './journey.entity';

@Entity({ name: 'MonthlyJourney' })
export class MonthlyJourneyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JourneyEntity, (journey) => journey.monthlyJourneys)
  journey: JourneyEntity;

  @Column()
  journey_id: number;

  @Column()
  year: number;

  @Column()
  month: number;
}
