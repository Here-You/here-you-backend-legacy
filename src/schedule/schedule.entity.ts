import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScheduleGroupEntity } from './schedule.group.entity';
import { ScheduleDetailEntity } from './schedule.detail.entity';

@Entity()
export class ScheduleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => ScheduleGroupEntity, (scheduleGroup) => scheduleGroup.schedules)
  scheduleGroup: ScheduleGroupEntity;

  @OneToMany(() => ScheduleDetailEntity, (scheduleDetail) => scheduleDetail.schedule)
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