import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScheduleEntity } from '../schedule/schedule.entity';
import { DetailScheduleInfoDto } from './detail-schedule-info.dto';

@Entity()
export class DetailScheduleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ default: false })
  isDone: boolean;

  @JoinColumn({ name: 'schedule_id' })
  @ManyToOne(() => ScheduleEntity, (schedule) => schedule.detailSchedules)
  schedule: ScheduleEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async createDetailSchedule(scheduleId) {
    const detailSchedule = new DetailScheduleEntity();
    detailSchedule.schedule = scheduleId;
    return await detailSchedule.save();
  }
}
