import {Injectable, HttpException, BadRequestException} from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { RuleMainEntity } from './domain/rule.main.entity';
import { RuleSubEntity } from './domain/rule.sub.entity';
import { RuleInvitationEntity } from './domain/rule.invitation.entity';
import { DetailPageDto } from './dto/detail-page.dto';
import { MetaToBackDto } from './dto/meta-to-back.dto';
import { UserEntity} from "../user/user.entity";

@Injectable()
export class RuleService {

  // [1] 여행 규칙 생성
  async createRule(dto: CreateRuleDto, userId: number): Promise<number> {
    // main 저장
    const main = new RuleMainEntity();
    main.mainTitle = dto.mainTitle;
    await main.save();
    console.log(main);

    //rule 저장
    const subs = dto.rulePairs.map(async (pair) => {
      const sub = new RuleSubEntity();
      sub.ruleTitle = pair.ruleTitle;
      sub.ruleDetail = pair.ruleDetail;
      sub.main = main;

      await sub.save();
      return sub;
    });
    console.log(subs);


    // invitation 저장
    const members = dto.membersId.map(async (memberId) : Promise<RuleInvitationEntity> => {
      const ruleInvitationEntity = new RuleInvitationEntity();

      const userEntity = await UserEntity.findOneOrFail({ where: { id: memberId } });
      ruleInvitationEntity.rule = main;
      ruleInvitationEntity.member = userEntity;

      await ruleInvitationEntity.save();
      return ruleInvitationEntity;
    });

    // 여행 규칙 글 작성자 정보 저장
    const writerEntity = new RuleInvitationEntity();

    const inviterEntity = await UserEntity.findOneOrFail({ where: { id: userId } });
    writerEntity.member = inviterEntity;
    writerEntity.rule = main;
    await writerEntity.save();

    return main.id;
  }

  // [2] 여행 규칙 조회
  async getDetail(ruleId : number, metaToBackDto : MetaToBackDto): Promise<DetailPageDto> {
    try{
      const detailPageDto : DetailPageDto = new DetailPageDto();

      return detailPageDto;
    }
    catch(error){
      console.error('Error on GetDetail : ', error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  // [3] 여행 규칙 나가기
  // -1) 초대 받은 팀원 -> 초대 삭제
  async deleteInvitation(ruleId: number, userId: number): Promise<RuleInvitationEntity> {
    const invitation : RuleInvitationEntity = await RuleInvitationEntity.findInvitationByRuleAndUser(ruleId, userId);

    return invitation.softRemove();
  }

  // [member] 초대 받은 멤버 리스트 생성
  async getInvitationList(ruleId: number) {
    try {
      const invitationEntity = await RuleInvitationEntity.find({
        where: { id : ruleId },
        relations: ['invited'],
      });
      return invitationEntity;
    } catch (error) {
      console.log('Error on getInvitationList: ' + error);
    }
  }

  // [member] 멤버인지 확인
  async checkMember(rule: RuleMainEntity, targetUserId: number): Promise<boolean> {
    const invitedArray = rule.invitations || [];

    const isMember = invitedArray.some(
      (invitations) => invitations.member.id  === targetUserId,
    );

    console.log('테스트 결과 : ', isMember);
    return isMember;
  }
}
