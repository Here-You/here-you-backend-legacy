import { BaseEntity, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn, 
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { RuleMainEntity } from './rule.main.entity'

@Entity()
export class RuleInvitationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RuleMainEntity, ruleMain => ruleMain.invitations)
  @JoinColumn({name: 'rule_id'})
  rule: RuleMainEntity;

  @ManyToOne(() => UserEntity, user => user.ruleParticipate)
  @JoinColumn({name: 'member_id'})
  member: UserEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async findNameById(inviterId: number): Promise<{ memberId : number, name : string }> {
    const userEntity : UserEntity = await UserEntity.findOne({
      where: { id: inviterId }
    });
    const memberId = inviterId;
    const name = userEntity.name;

    return { memberId, name };
  }

  static async findInvitationByRuleId(ruleId: number): Promise<RuleInvitationEntity[]> {
    try {
      const invitation = await RuleInvitationEntity.find({
        where: {rule: {id : ruleId}},
        relations: {member:true},
      });
      console.log('invitation 조회 결과 : ', invitation);
      return invitation;
    } catch (error) {
      console.log('Error on findInvitationByRuleId: ', error);
      throw error;
    }
  }

  static async findInvitationByRuleAndUser(ruleId: number, userId: number) : Promise<RuleInvitationEntity> {
    try {
      const invitation = await RuleInvitationEntity.findOne({
        where: [{rule: {id : ruleId}},
          {member: {id : userId}}]
      });
      console.log('invitation 조회 결과 : ', invitation);
      return invitation;
    } catch (error) {
      console.log('Error on findInvitationByRuleId: ', error);
      throw error;
    }
  }

  // [member] 멤버인지 확인
  static async isAlreadyMember(ruleId: number, targetUserId: number) :Promise<boolean> {
    const isAlreadyMember = await RuleInvitationEntity.findOne({
      where : {member: {id : targetUserId}, rule: {id : ruleId}}
    })
    console.log(isAlreadyMember);

    if (!!isAlreadyMember) return true;
    else return false;
  }
}