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
import { UserEntity } from '../user/user.entity';

@Entity()
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => UserEntity)
  notificationReceiver: UserEntity;

  @Column({ type: 'enum', enum: ['LIKE', 'COMMENT'] })
  notificationType: 'LIKE' | 'COMMENT';

  @Column()
  notificationContent: string;

  @Column()
  notificationItemId: number;

  @Column({ default: false })
  notificationRead: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}