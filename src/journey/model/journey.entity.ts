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
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { UserEntity } from 'src/user/user.entity';
import { MonthInfoDto } from 'src/map/month-info.dto';
import { CreateJourneyDto } from '../dtos/create-journey.dto';

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

  //여정 생성하기
  static async createJourney(user, createJourneyDto) {
    try {
      const journey: JourneyEntity = new JourneyEntity();
      journey.title = createJourneyDto.title;
      journey.startDate = createJourneyDto.startDate;
      journey.endDate = createJourneyDto.endDate;
      journey.user = user;

      return await journey.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  //여정 수정하기
  static async updateJourney(journey: JourneyEntity, title: string) {
    journey.title = title;
    return await journey.save();
  }

  //여정 삭제하기
  static async deleteJourney(journey) {
    return await JourneyEntity.remove(journey);
  }

  //여정 조회
  static async findExistJourney(journeyId: number) {
    const journey: JourneyEntity = await JourneyEntity.findOne({
      where: {
        id: journeyId,
      },
    });
    return journey;
  }

  static async findExistJourneysByUserId(userId) {
    const journeys: JourneyEntity[] = await JourneyEntity.find({
      where: { user: { id: userId } },
    });

    return journeys;
  }

  static async findExistJourneyByOptions(userId, journeyId) {
    const journey: JourneyEntity = await JourneyEntity.findOne({
      where: {
        id: journeyId,
        user: { id: userId },
      },
    });
    return journey;
  }

  static async findExistJourneyByPeriod(userId, createJourneyDto) {
    const journey: JourneyEntity = await JourneyEntity.findOne({
      where: {
        user: { id: userId },
        startDate: LessThanOrEqual(createJourneyDto.endDate),
        endDate: MoreThanOrEqual(createJourneyDto.startDate),
      },
    });

    return journey;
  }

  static async findExistJourneyByDate(userId: number, date: Date) {
    const journeys: JourneyEntity[] = await JourneyEntity.find({
      where: {
        user: { id: userId },
      },
    });

    // 매개변수로 받은 날짜가 어느 여정에 포함되어 있는지 확인
    const matchingJourney = journeys.find((journey) => {
      return isWithinInterval(date, {
        start: journey.startDate,
        end: journey.endDate,
      });
    });

    return matchingJourney;
  }

  //사용자의 월별 여정 조회
  static async findMonthlyJourney(userId: number, dates: MonthInfoDto) {
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
