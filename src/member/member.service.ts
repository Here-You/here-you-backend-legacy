import { Injectable, HttpException } from '@nestjs/common';
import { MemberDto } from './dto/member.dto';
import { RuleInvitationEntity } from 'src/rule/domain/rule.invitation.entity';
import { UserEntity } from "../user/user.entity";
import { UserService} from "../user/user.service";
import {RuleMainEntity} from "../rule/domain/rule.main.entity";
import { S3UtilService } from "../utils/S3.service";

@Injectable()
export class MemberService {
    constructor(
        private userService: UserService,
        private readonly s3Service: S3UtilService,
    ) {}

    // [1] 여행 규칙 멤버 리스트 조회
    async getMemberList(ruleId: number): Promise<MemberDto[]> {
        const ruleEntity : RuleMainEntity = await RuleMainEntity.findOneOrFail({
            where: {id : ruleId},
            relations: ['invitations']
        });

        const members : MemberDto[] = await Promise.all(ruleEntity.invitations.map(async (invitation) : Promise<MemberDto> => {
            const memberEntity : UserEntity = invitation.member;
            const memberDto : MemberDto = new MemberDto();

            memberDto.id = memberEntity.id;
            memberDto.name = memberEntity.name;
            memberDto.email = memberEntity.email;
            memberDto.introduction = memberEntity.introduction;

            // 사용자 프로필 이미지
            const image = await this.userService.getProfileImage(memberEntity.id);
            memberDto.image = image.imageKey;
            if(image == null) memberDto.image = null;
            else {
                const userImageKey = image.imageKey;
                memberDto.image = await this.s3Service.getImageUrl(userImageKey);
            }
            return memberDto;
        }))

        return members;
    }

    // [2] 여행 규칙 멤버 초대
    async createInvitation(ruleId: number, invitedId: number): Promise<RuleInvitationEntity> {
  
        const invitationEntity : RuleInvitationEntity = new RuleInvitationEntity();
        const ruleEntity : RuleMainEntity = await RuleMainEntity.findRuleById(ruleId);
        const invitedUserEntity : UserEntity = await this.userService.findUserById(invitedId);

        invitationEntity.rule = ruleEntity;
        invitationEntity.member = invitedUserEntity;

        return invitationEntity.save();
    }
    
    // [3] 여행 규칙 멤버 삭제
    async deleteMember(ruleId: number, memberId: number): Promise<RuleInvitationEntity> {
        const ruleEntity : RuleMainEntity = await RuleMainEntity.findRuleById(ruleId);
        const invitation = await RuleInvitationEntity.findOne({
            where: {rule :{id : ruleId}, member : {id : memberId}}
        })

        return invitation.softRemove();
    }
}