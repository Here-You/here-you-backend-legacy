// journey.entity.ts

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DateGroupEntity } from '../../date-group/date-group.entity';
import { MonthlyJourneyEntity } from './monthly-journey.entity';
import { CreateJourneyDto } from '../dtos/create-journey.dto';

@Entity()
export class JourneyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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

  static async createJourney(createJourneyDto: CreateJourneyDto, dateGroupId) {
    try {
      const journey: JourneyEntity = new JourneyEntity();
      journey.journey_title = createJourneyDto.journey_title;
      journey.dateGroup = dateGroupId;

      return await journey.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
