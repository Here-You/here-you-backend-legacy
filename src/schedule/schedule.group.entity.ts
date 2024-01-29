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
import { JourneyEntity } from '../journey/model/journey.entity';
import { ScheduleEntity } from './schedule.entity';

@Entity({ name: 'schedule_group' })
export class ScheduleGroupEntity {
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

  @ManyToOne(() => JourneyEntity, (journey) => journey.scheduleGroups)
  journey: JourneyEntity;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.scheduleGroup)
  schedules: ScheduleEntity[];
}
