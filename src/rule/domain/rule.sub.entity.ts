import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { RuleMainEntity } from './rule.main.entity';

@Entity()
export class RuleSubEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  ruleTitle: string;

  @Column({ type: 'text' })
  ruleDetail: string;

  @ManyToOne(() => RuleMainEntity, ruleMain => ruleMain.rules)
  @JoinColumn({ name: 'rule_id'})
  main: RuleMainEntity;
}