import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  Between,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseResponse } from 'src/response/response.status';
import { DetailScheduleEntity } from '../detail-schedule/detail-schedule.entity';
import { LocationEntity } from 'src/location/location.entity';
import { DiaryEntity } from 'src/diary/models/diary.entity';
import { JourneyEntity } from 'src/journey/model/journey.entity';
import { FindMonthlyJourneyDto } from 'src/journey/dtos/find-monthly-journey.dto';

@Entity()
export class ScheduleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => LocationEntity, (location) => location.schedule)
  location: LocationEntity;

  @ManyToOne(() => JourneyEntity, (journey) => journey.schedules)
  journey: JourneyEntity;

  @OneToMany(
    () => DetailScheduleEntity,
    (detailSchedule) => detailSchedule.schedule,
  )
  detailSchedules: DetailScheduleEntity[];

  @OneToOne(() => DiaryEntity, (diary) => diary.schedule)
  diary: DiaryEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  //일정 작성하기
  static async createSchedule(journey, currentDate) {
    const schedule = new ScheduleEntity();
    schedule.date = currentDate.toISOString().split('T')[0];
    schedule.journey = journey.id;
    return await schedule.save();
  }

  //일정 작성하기 : title
  static async updateScheduleTitle(schedule, updateScheduleDto) {
    schedule.title = updateScheduleDto.title;
    return await schedule.save();
  }

  //일정 작성하기 : location
  static async updateScheduleLocation(schedule, location) {
    schedule.location = location.id;
    return await schedule.save();
  }

  //일정 조회하기
  static async findExistSchedule(scheduleId) {
    const schedule = await ScheduleEntity.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException(BaseResponse.SCHEDULE_NOT_FOUND);
    }
    return schedule;
  }
  // 월별 일정 조회하기
  static async findMonthlySchedule(
    journeyId,
    dates: FindMonthlyJourneyDto,
  ): Promise<ScheduleEntity[]> {
    const firstDate = new Date(`${dates.year}-${dates.month}-01`);
    const lastDate = new Date(`${dates.year}-${dates.month}-31`);
    const schedule = await ScheduleEntity.find({
      where: {
        journey: { id: journeyId },
        date: Between(firstDate, lastDate),
      },
    });
    return schedule;
  }
}
