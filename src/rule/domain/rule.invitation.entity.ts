import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { RuleMainEntity } from './rule.main.entity'

@Entity()
export class RuleInvitationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RuleMainEntity, ruleMain => ruleMain.invitations)
  @JoinColumn({name: 'rule_id'})
  rule: RuleMainEntity;

  @ManyToOne(() => UserEntity, user => user.invitationsSent)
  @JoinColumn({name: 'inviter_id'})
  inviter: UserEntity;

  @ManyToOne(() => UserEntity, user => user.invitationsReceived)
  @JoinColumn({name: 'invited_id'})
  invited: UserEntity;
}