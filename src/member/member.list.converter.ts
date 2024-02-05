import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { MemberDto } from './dto/member.dto';
import { UserService } from 'src/user/user.service';
import { RuleService } from 'src/rule/rule.service';
import { RuleInvitationEntity } from 'src/rule/domain/rule.invitation.entity';

@Injectable()
export class MemberListConverter {

    constructor(
        private readonly userService: UserService,
        private readonly ruleService: RuleService,

    ) {}

    // [1] 여행 규칙 멤버 정보 리스트 DTO 생성
    async toDto(userId: number,ruleId: number): Promise<MemberDto[]> {

        // 여행 초대 객체 생성
        const invitations : RuleInvitationEntity[] = await this.ruleService.getInvitationList(ruleId);

        // 여행 참여 멤버 정보 리스트 생성
        // -1. 팀원 멤버 (invited) 정보 추가
        const informs = await Promise.all(invitations.map(async (invitaiton) => {
            const memberDto : MemberDto = new MemberDto();
            const invited : UserEntity = invitaiton.invited; 

            memberDto.memberId = invited.id;
            memberDto.name = invited.name;
            memberDto.nickName = invited.nickname;
            memberDto.introduction = invited.introduction;
            const image = await this.userService.getProfileImage(invited.id);
            memberDto.image = image.imageKey;

            return memberDto;
        }))

        // -2. 팀장 멤버 (inviter) 정보 추가
        const inviterDto : MemberDto = new MemberDto();
        const inviter : UserEntity = await this.userService.findUserById(userId);

        inviterDto.memberId = inviter.id;
        inviterDto.name = inviter.name;
        inviterDto.nickName = inviter.nickname;
        inviterDto.introduction = inviter.introduction;
        const image = await this.userService.getProfileImage(inviter.id);
        inviterDto.image = image.imageKey;

        informs.push(inviterDto);
        
        return informs;
    }
}