import { BaseEntity, 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn, 
} from 'typeorm';
import { RuleSubEntity } from './rule.sub.entity';
import { RuleMemberEntity } from './rule.member.entity'
import { CommentEntity } from 'src/comment/domain/comment.entity';

@Entity()
export class RuleMainEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  mainTitle: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @OneToMany(() => RuleSubEntity, ruleSub => ruleSub.main)
  rules: RuleSubEntity[];

  @OneToMany(() => RuleMemberEntity, ruleInvitation => ruleInvitation.rule)
  members: RuleMemberEntity[];

  @OneToMany(() => CommentEntity, comment => comment.rule)
  comments: CommentEntity[];

  static async findMainById(ruleId: number): Promise<RuleMainEntity> {
    const ruleMain : RuleMainEntity = await RuleMainEntity.findOne({
      where: { id: ruleId },
      relations: ['rules', 'invitations', 'comments']
    });

    return ruleMain;
  }

  static async findRuleById(ruleId: number): Promise<RuleMainEntity> {
    try {
      const rule: RuleMainEntity = await RuleMainEntity.findOne({
        where: { id: ruleId },
      });
      return rule;
    } catch (error) {
      console.log('Error on findRuleById: ', error);
      throw error;
    }
  }
}