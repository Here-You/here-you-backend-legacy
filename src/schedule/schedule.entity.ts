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

import { ScheduleDetailEntity } from './schedule.detail.entity';
import { LocationEntity } from 'src/location/location.entity';

@Entity()
export class ScheduleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  title: string;

  @OneToMany(
    () => ScheduleDetailEntity,
    (scheduleDetail) => scheduleDetail.schedule,
  )
  scheduleDetails: ScheduleDetailEntity[];

  @OneToOne(() => LocationEntity, { eager: true }) // eager 옵션을 사용하여 즉시 로드
  @JoinColumn({ name: 'location_id' }) // 외래 키에 대한 컬럼명 설정
  location: LocationEntity;

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

  static async updateSchedule(schedule, title) {
    schedule.title = title;
    console.log(title);
    return await schedule.save();
  }
}
