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

  @OneToMany(
    () => ScheduleDetailEntity,
    (scheduleDetail) => scheduleDetail.schedule,
  )
  scheduleDetails: ScheduleDetailEntity[];

  @Column({ type: 'date' })
  date: Date;

  @Column()
  title: string;

  @Column()
  participants: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
