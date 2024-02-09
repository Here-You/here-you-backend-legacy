import {Injectable, HttpException, BadRequestException} from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { RuleMainEntity } from './domain/rule.main.entity';
import { RuleSubEntity } from './domain/rule.sub.entity';
import { RuleInvitationEntity } from './domain/rule.invitation.entity';
import { UserEntity} from "../user/user.entity";
import {DetailMemberDto, DetailRuleDto, RulePairDto} from "./dto/detail.rule.dto";
import { S3UtilService} from "../utils/S3.service";
import {UserService} from "../user/user.service";

@Injectable()
export class RuleService {
  constructor(
      private readonly s3Service: S3UtilService,
  ) {}

  // [1] 여행 규칙 생성
  async createRule(dto: CreateRuleDto, userId: number): Promise<number> {
    // -1) main 저장
    const main = new RuleMainEntity();
    main.mainTitle = dto.mainTitle;
    await main.save();
    console.log(main);

    // -2) rule 저장
    const subs = await Promise.all(dto.rulePairs.map(async (pair) => {
      const sub = new RuleSubEntity();
      sub.ruleTitle = pair.ruleTitle;
      sub.ruleDetail = pair.ruleDetail;
      sub.main = main;

      await sub.save();
      return sub;
    }));
    console.log(subs);


    // -3) invitation 저장
    const members = await Promise.all(dto.membersId.map(async (memberId) : Promise<RuleInvitationEntity> => {
      const ruleInvitationEntity = new RuleInvitationEntity();

      const userEntity = await UserEntity.findOneOrFail({ where: { id: memberId } });
      ruleInvitationEntity.rule = main;
      ruleInvitationEntity.member = userEntity;

      await ruleInvitationEntity.save();
      return ruleInvitationEntity;
    }));

    // -4) 여행 규칙 글 작성자 정보 저장
    const writerEntity = new RuleInvitationEntity();

    const inviterEntity = await UserEntity.findOneOrFail({ where: { id: userId } });
    writerEntity.member = inviterEntity;
    writerEntity.rule = main;
    await writerEntity.save();

    return main.id;
  }

  // [2] 여행 규칙 조회
  async getDetail(ruleId : number): Promise<DetailRuleDto> {
    const dto = new DetailRuleDto();
    const main: RuleMainEntity = await RuleMainEntity.findRuleById(ruleId);
    const subs: RuleSubEntity[] = await RuleSubEntity.findSubById(ruleId);
    const invitations: RuleInvitationEntity[] = await RuleInvitationEntity.findInvitationByRuleId(ruleId);

    // -1) 제목
    dto.id = ruleId;
    dto.mainTitle = main.mainTitle;

    // -2) 규칙
    dto.rulePairs = await Promise.all(subs.map(async(sub):Promise<RulePairDto> => {
      const rulePair = new RulePairDto();
      rulePair.id = sub.id;
      rulePair.ruleTitle = sub.ruleTitle;
      rulePair.ruleDetail = sub.ruleDetail;

      return rulePair;
    }))

    // -3) 멤버 정보
    dto.detailMembers = await Promise.all(invitations.map(async(invitation):Promise<DetailMemberDto> => {
      const detailMember = new DetailMemberDto;
      const memberEntity = invitation.member;
      detailMember.id = memberEntity.id;
      detailMember.name = memberEntity.name;

      // 사용자 프로필 이미지
      const image = memberEntity.profileImage;
      if(image == null) detailMember.image = null;
      else{
        const userImageKey = image.imageKey;
        detailMember.image = await this.s3Service.getImageUrl(userImageKey);
      }
      return detailMember;
    }))
    return dto;
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
}
