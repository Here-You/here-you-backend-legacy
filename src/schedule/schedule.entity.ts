import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseResponse } from 'src/response/response.status';
import { DetailScheduleEntity } from '../detail-schedule/detail-schedule.entity';
import { LocationEntity } from 'src/location/location.entity';
import { DiaryEntity } from 'src/diary/models/diary.entity';

@Entity()
export class ScheduleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  title: string;

  @OneToMany(
    () => DetailScheduleEntity,
    (detailSchedule) => detailSchedule.schedule,
  )
  detailSchedules: DetailScheduleEntity[];

  @OneToOne(() => LocationEntity, { eager: true }) // eager 옵션을 사용하여 즉시 로드
  @JoinColumn({ name: 'locationId' }) // 외래 키에 대한 컬럼명 설정
  location: LocationEntity;

  @OneToOne(() => DiaryEntity, (diary) => diary.schedule, { cascade: true })
  diary: DiaryEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async createSchedule(dates) {
    let currentDate = new Date(dates.startDate);
    const lastDate = new Date(dates.endDate);

    while (currentDate <= lastDate) {
      const schedule = new ScheduleEntity();
      schedule.date = currentDate.toISOString().split('T')[0];
      await schedule.save();
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
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
