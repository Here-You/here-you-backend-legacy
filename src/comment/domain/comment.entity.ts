import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { RuleMainEntity } from 'src/rule/domain/rule.main.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity()
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  content: string;

  @ManyToOne(() => RuleMainEntity, ruleMain => ruleMain.comments)
  @JoinColumn({ name: 'rule_id'})
  rule: RuleMainEntity;

  @ManyToOne(() => UserEntity, user => user.comments)
  @JoinColumn({ name: 'user_id'})
  user: UserEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}