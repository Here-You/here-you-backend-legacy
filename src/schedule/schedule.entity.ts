import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseResponse } from 'src/response/response.status';
import { DetailScheduleEntity } from '../detail-schedule/detail-schedule.entity';
import { LocationEntity } from 'src/location/location.entity';
import { DiaryEntity } from 'src/diary/models/diary.entity';
import { JourneyEntity } from 'src/journey/model/journey.entity';

@Entity()
export class ScheduleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => LocationEntity, (location) => location.id)
  locationId: Location;

  @ManyToOne(() => JourneyEntity, (journey) => journey.schedules)
  journeyId: JourneyEntity;

  @OneToMany(
    () => DetailScheduleEntity,
    (detailSchedule) => detailSchedule.scheduleId,
  )
  detailSchedules: DetailScheduleEntity[];

  @OneToOne(() => DiaryEntity, (diary) => diary.scheduleId, { cascade: true })
  diary: DiaryEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async createSchedule(journey, currentDate) {
    const schedule = new ScheduleEntity();
    schedule.date = currentDate.toISOString().split('T')[0];

    return await schedule.save();
  }

  static async updateScheduleTitle(schedule, title) {
    schedule.title = title;
    return await schedule.save();
  }

  static async updateScheduleLocation(schedule, location) {
    schedule.location = location.id;
    return await schedule.save();
  }

  static async findExistSchedule(scheduleId) {
    const schedule = await ScheduleEntity.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException(BaseResponse.SCHEDULE_NOT_FOUND);
    }
    return schedule;
  }
}
