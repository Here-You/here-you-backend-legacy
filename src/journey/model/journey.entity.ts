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
  Between,
  JoinColumn,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';

import { CreateJourneyDto } from '../dtos/create-journey.dto';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { UserEntity } from 'src/user/user.entity';
import { FindMonthlyJourneyDto } from '../dtos/find-monthly-journey.dto';
import { errResponse } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';

@Entity()
export class JourneyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

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

  static async createJourney(user, createJourneyDto) {
    try {
      const journey: JourneyEntity = new JourneyEntity();
      journey.title = createJourneyDto.title;
      journey.startDate = createJourneyDto.startDate;
      journey.endDate = createJourneyDto.endDate;
      journey.user = user.id;

      return await journey.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  static async findMonthlyJourney(userId, dates: FindMonthlyJourneyDto) {
    const firstDate = new Date(`${dates.year}-${dates.month}-01`);
    const lastDate = new Date(`${dates.year}-${dates.month}-31`);
    const journeys: JourneyEntity[] = await JourneyEntity.find({
      where: [
        {
          user: { id: userId },
          startDate: Between(firstDate, lastDate),
        },
        {
          user: { id: userId },
          endDate: Between(firstDate, lastDate),
        },
      ],
    });
    return journeys;
  }
}
