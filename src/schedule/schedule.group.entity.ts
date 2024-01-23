import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { JourneyEntity } from '../journey/journey.entity';
import { ScheduleEntity } from './schedule.entity';

@Entity({ name: 'schedule_group' })
export class ScheduleGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  date: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Journey, (journey) => journey.scheduleGroups)
  journey: JourneyEntity;

  @OneToMany(() => Schedule, (schedule) => schedule.scheduleGroup)
  schedules: ScheduleEntity[];
}
