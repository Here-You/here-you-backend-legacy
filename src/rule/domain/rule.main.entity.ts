import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RuleSubEntity } from './rule.sub.entity';
import { RuleInvitationEntity } from './rule.invitation.entity'

@Entity()
export class RuleMainEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  mainTitle: string;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  @OneToMany(() => RuleSubEntity, ruleSub => ruleSub.main)
  rules: RuleSubEntity[];

  @OneToMany(() => RuleInvitationEntity, ruleInvitation => ruleInvitation.rule)
  invitations: RuleInvitationEntity[];
}