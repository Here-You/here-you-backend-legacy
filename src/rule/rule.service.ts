import { Injectable } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
// import { RuleConverter } from './rule.converter';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuleMainEntity } from './domain/rule.main.entity';
import { RuleSubEntity } from './domain/rule.sub.entity';
import { RuleInvitationEntity } from './domain/rule.invitation.entity';

@Injectable()
export class RuleService {
  constructor(
    private ruleConverter: RuleConverter,
  ) {}

  async createRule(createRuleDto: CreateRuleDto, userId: number): Promise<any> {
    // Extract necessary information from the DTO
    const { main, rules, invitations } = await this.ruleConverter.toEntity(createRuleDto);

    // Save main rule entity
    const savedMain = await this.ruleMainRepository.save(main);

    // Save rule sub entities
    const savedRules = await this.ruleSubRepository.save(rules);

    // Save rule invitation entities
    const savedInvitations = await this.ruleInvitationRepository.save(invitations);

    // Return response
    return {
      status: 201,
      success: true,
      message: '여행 규칙 작성 및 메이트 초대 성공',
      data: {
        write: {
          id: savedMain.id,
          mainTitle: savedMain.mainTitle,
          created: savedMain.created.getTime(),
          rules: savedRules.map(rule => ({
            id: rule.id,
            ruleTitle: rule.ruleTitle,
            ruleDetail: rule.ruleDetail,
          })),
        },
        invitations: savedInvitations.map(invitation => ({
          id: invitation.id,
          inviterId: userId,
          invitedId: invitation.invited.id,
        })),
      }
    };
  }
}
