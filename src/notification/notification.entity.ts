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

  @JoinColumn()
  @ManyToOne(() => UserEntity)
  notificationSender: UserEntity;

  @Column({ type: 'enum', enum: ['SIGNATURE', 'RULE'] })
  notificationTargetType: 'SIGNATURE' | 'RULE';

  @Column()
  notificationTargetId: number;

  @Column({ type: 'enum', enum: ['LIKE', 'COMMENT'] })
  notificationAction: 'LIKE' | 'COMMENT';

  @Column({ default: false })
  notificationRead: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
