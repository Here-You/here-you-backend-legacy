// journey.entity.ts

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DateGroupEntity } from '../../date/model/date-group.entity';
import { MonthlyJourneyEntity } from './monthly-journey.entity';

@Entity()
export class JourneyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  journey_title: string;

  @ManyToOne(() => DateGroupEntity, (dateGroup) => dateGroup.journeys)
  @JoinColumn({ name: 'date_group_id' })
  dateGroup: DateGroupEntity;

  @ManyToOne(
    () => MonthlyJourneyEntity,
    (monthlyJourney) => monthlyJourney.journeys,
  )
  @JoinColumn({ name: 'monthly_id' })
  monthlyJourney: MonthlyJourneyEntity;
}
