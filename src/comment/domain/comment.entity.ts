import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RuleMainEntity } from 'src/rule/domain/rule.main.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity()
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  content: string;

  @ManyToOne(() => RuleMainEntity, ruleMain => ruleMain.comments)
  @JoinColumn({ name: 'rule_id'})
  rule: RuleMainEntity;

  @ManyToOne(() => UserEntity, user => user.comments)
  @JoinColumn({ name: 'user_id'})
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;
}