import { BaseEntity, 
  Column, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { RuleMainEntity } from './rule.main.entity';

@Entity()
export class RuleSubEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  ruleTitle: string;

  @Column({ type: 'text' })
  ruleDetail: string;

  @ManyToOne(() => RuleMainEntity, ruleMain => ruleMain.rules)
  @JoinColumn({ name: 'rule_id'})
  main: RuleMainEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async findSubById(ruleId: number): Promise<RuleSubEntity[]> {
    try {
      const rule: RuleSubEntity[] = await RuleSubEntity.find({
        where: {main: {id : ruleId}},
      });
      return rule;
    } catch (error) {
      console.log('Error on findRuleById: ', error);
      throw error;
    }
  }
}