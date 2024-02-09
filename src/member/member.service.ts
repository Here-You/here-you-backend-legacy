import {Injectable, NotFoundException} from '@nestjs/common';
import { RuleInvitationEntity } from 'src/rule/domain/rule.invitation.entity';
import { UserEntity } from "../user/user.entity";
import { UserService} from "../user/user.service";
import {RuleMainEntity} from "../rule/domain/rule.main.entity";
import { S3UtilService } from "../utils/S3.service";
import {ResponseDto} from "../response/response.dto";
import {ResponseCode} from "../response/response-code.enum";

@Injectable()
export class MemberService {
    constructor(
        private userService: UserService,
        private readonly s3Service: S3UtilService,
    ) {}

    // [2] 여행 규칙 멤버 초대
    async createInvitation(ruleId: number, invitedId: number): Promise<ResponseDto<any>> {
        // (1) 존재하는 회원인지 확인
        const invitedEntity = await this.userService.findUserById(invitedId);
        if(!invitedEntity) {
            return new ResponseDto(
                ResponseCode.USER_NOT_FOUND,
                false,
                "존재하지 않는 회원 입니다",
                null
            );
        }

        // (2) 이미 초대된 멤버인지 확인
        const isAlreadyMember = await RuleInvitationEntity.findInvitationByRuleAndUser(ruleId, invitedId);
        console.log('isAlreadyMember', isAlreadyMember);

        if (!isAlreadyMember) {
            const invitationEntity : RuleInvitationEntity = new RuleInvitationEntity();
            const ruleEntity : RuleMainEntity = await RuleMainEntity.findRuleById(ruleId);
            const invitedUserEntity : UserEntity = await this.userService.findUserById(invitedId);

            invitationEntity.rule = ruleEntity;
            invitationEntity.member = invitedUserEntity;

            await invitationEntity.save();
            return new ResponseDto(
                ResponseCode.INVITATION_CREATED,
                true,
                "여행 규칙 멤버 초대 성공",
                null
            );
        } else {
            return new ResponseDto(
                ResponseCode.IS_ALREADY_MEMBER,
                false,
                "이미 초대된 멤버 입니다",
                null
            );
        }
    }
    
    // [3] 여행 규칙 멤버 삭제
    async deleteMember(ruleId: number, memberId: number) :Promise<ResponseDto<any>> {
        // (1) 존재하는 회원인지 확인
        const invitedEntity = await this.userService.findUserById(memberId);
        if(!invitedEntity) {
            return new ResponseDto(
                ResponseCode.USER_NOT_FOUND,
                false,
                "존재하지 않는 회원 입니다",
                null
            );
        }

        // (2) 이미 초대된 멤버인지 확인
        const isAlreadyMember = await RuleInvitationEntity.findInvitationByRuleAndUser(ruleId, memberId);
        console.log('isAlreadyMember', isAlreadyMember);

        if (!!isAlreadyMember) {
            const invitation = await RuleInvitationEntity.findOne({
                where: { rule: { id: ruleId }, member: { id: memberId } }
            });
            await invitation.softRemove();

            return new ResponseDto(
                ResponseCode.DELETE_MEMBER_SUCCESS,
                true,
                "여행 규칙 멤버 삭제 성공",
                null
            );
        } else {
            return new ResponseDto(
                ResponseCode.IS_NOT_MEMBER,
                false,
                "초대된 회원이 아닙니다",
                null
            );
        }
    }
}