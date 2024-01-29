// monthly-journey.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JourneyEntity } from './journey.entity';

@Entity()
export class MonthlyJourneyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'year' })
  year: number;

  @Column({ name: 'month' })
  month: number;

  @OneToMany(() => JourneyEntity, (journey) => journey.monthlyJourney)
  journeys: JourneyEntity[];
}
