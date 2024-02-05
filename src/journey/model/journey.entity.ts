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

  @Column({ nullable: true })
  endDate: string;

  @JoinColumn()
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

  // static async getMonthlyJourney(journeys: JourneyEntity[], dates) {
  //   const monthlyJourneys: JourneyEntity[] = journeys.filter((journey) => {
  //     return (
  //       journey.startDate >= dates.startDate && journey.endDate <= dates.endDate
  //     );
  //   });
  //   console.log(monthlyJourneys);
  //   return monthlyJourneys;
  // }

  static async findJourneysByuserId(userId) {
    const journeys: JourneyEntity[] = await JourneyEntity.find({
      where: {
        user: { id: userId },
      },
      select: ['id', 'title', 'startDate', 'endDate'],
    });
    return journeys;
  }
}
