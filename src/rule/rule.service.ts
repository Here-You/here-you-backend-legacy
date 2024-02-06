import { Injectable, HttpException } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { RuleConverter } from './rule.converter';
import { RuleMainEntity } from './domain/rule.main.entity';
import { RuleSubEntity } from './domain/rule.sub.entity';
import { RuleInvitationEntity } from './domain/rule.invitation.entity';
import { DetailPageDto } from './dto/detail-page.dto';
import { DetailRuleDto } from './dto/detail-rule.dto';
import { DetailMemberDto } from './dto/detail-member.dto';
import { DetailCommentDto } from './dto/detail-comment.dto';
import { MetaToBackDto } from './dto/meta-to-back.dto';
import { TotalListDto } from './dto/total-list.dto';


@Injectable()
export class RuleService {
  constructor(
    private ruleConverter: RuleConverter,
  ) {}

  // [1] 여행 규칙 생성
  async createRule(createRuleDto: CreateRuleDto): Promise<number> {
    const { main, rules, invitations } = await this.ruleConverter.toEntity(createRuleDto);

    const savedMain = await RuleMainEntity.save(main);

    const savedRules = await RuleSubEntity.save(rules);

    const savedInvitations = await RuleInvitationEntity.save(invitations);

    return savedMain.id;
  }

  // *수정
  // [2] 여행 규칙 및 댓글 조회
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

  // *진행 중
  // [3] 여행 규칙 전체 리스트 조회
  async getTotalList(userId: number): Promise<TotalListDto[]> {
    try{
      console.log('service 진입');
      const totalList : TotalListDto[] = await this.ruleConverter.toComplete(userId);
      
      return totalList;  
    }
    catch(error){
      console.error('Error on GetTotalList : ', error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  // [4] 여행 규칙 삭제
  // async deleteRule(userId: number): Promise<TotalListDto[]> {return }
 
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
      (invitations) => invitations.invited.id  === targetUserId,
    );

    console.log('테스트 결과 : ', isMember);
    return isMember;
  }
}
