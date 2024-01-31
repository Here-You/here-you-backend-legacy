import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class ScheduleGroupEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.scheduleGroup)
  schedules: ScheduleEntity[];

  @JoinColumn()
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
