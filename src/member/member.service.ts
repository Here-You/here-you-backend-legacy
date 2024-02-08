import { Injectable, HttpException } from '@nestjs/common';
import { MemberDto } from './dto/member.dto';
import { RuleInvitationEntity } from 'src/rule/domain/rule.invitation.entity';
import { RuleService } from 'src/rule/rule.service';
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";
import {RuleMainEntity} from "../rule/domain/rule.main.entity";

@Injectable()
export class MemberService {
    constructor(
        private ruleService: RuleService,
        private userService : UserService,
    ) {}

    // [1] 여행 규칙 멤버 리스트 조회
    async getMemberList(userId: number, ruleId: number): Promise<MemberDto[]> {

        const ruleEntity = await RuleMainEntity.findOne({
            where : {id : ruleId},
            relations : ['invitations']
        });

        const invitations = ruleEntity.invitations;
        let members : UserEntity[] = await Promise.all(invitations.map(async (invitation) : Promise<UserEntity> => {
            const memberEntity : UserEntity = invitation.invited;

            return memberEntity;
        }));

        // 팀장 정보 추가
        const inviter = await RuleInvitationEntity.findOne({
            where : {invited : {id : userId}},
            relations : ['inviter']
        });
        members.push();

    }

    // [2] 여행 규칙 멤버 초대
    async createInvitation(ruleId: number, userId: number, invitedId: number): Promise<RuleInvitationEntity> {
  
        // invitation 객체 생성
        const invitation = RuleInvitationEntity.create({
            rule: { id : ruleId },
            inviter: { id : userId},
            invited: { id : invitedId},
        })
        return invitation.save();
    }
    
    // [3] 여행 규칙 멤버 삭제
    async deleteMember(ruleId: number, memberId: number): Promise<RuleInvitationEntity> {
        const invitation : RuleInvitationEntity = await RuleInvitationEntity.findInvitationByRuleId(ruleId, memberId);

        return invitation.softRemove();
    }
}