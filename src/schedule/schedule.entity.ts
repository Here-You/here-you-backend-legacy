import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ScheduleDetailEntity } from './schedule.detail.entity';

@Entity()
export class ScheduleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  participants: string;

  @OneToMany(
    () => ScheduleDetailEntity,
    (scheduleDetail) => scheduleDetail.schedule,
  )
  scheduleDetails: ScheduleDetailEntity[];

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
}
