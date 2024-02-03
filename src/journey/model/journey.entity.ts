// journey.entity.ts

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CreateJourneyDto } from '../dtos/create-journey.dto';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity()
export class JourneyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @ManyToOne(() => UserEntity, (user) => user.journeys)
  user: UserEntity;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.journey)
  schedules: ScheduleEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async createJourney(createJourneyDto) {
    try {
      const journey: JourneyEntity = new JourneyEntity();
      journey.title = createJourneyDto.title;
      journey.startDate = createJourneyDto.startDate;
      journey.endDate = createJourneyDto.endDate;
      journey.user = createJourneyDto.userId;

      return await journey.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
