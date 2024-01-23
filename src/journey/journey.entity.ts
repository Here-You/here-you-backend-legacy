// journey.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ScheduleGroupEntity } from '../schedule/schedule.group.entity';
import { MonthlyJourneyEntity } from './monthly-journey.entity';

@Entity({ name: 'Journey' })
export class JourneyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  journey_title: string;

  @OneToMany(
    () => ScheduleGroupEntity,
    (scheduleGroup) => scheduleGroup.journey,
  )
  scheduleGroups: ScheduleGroupEntity[];

  @OneToMany(
    () => MonthlyJourneyEntity,
    (monthlyJourney) => monthlyJourney.journey,
  )
  monthlyJourneys: MonthlyJourneyEntity[];
}
