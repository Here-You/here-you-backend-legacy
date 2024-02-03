import { Injectable } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { RuleConverter } from './rule.converter';
import { RuleMainEntity } from './domain/rule.main.entity';
import { RuleSubEntity } from './domain/rule.sub.entity';
import { RuleInvitationEntity } from './domain/rule.invitation.entity';

@Injectable()
export class RuleService {
  constructor(
    private ruleConverter: RuleConverter,
  ) {}

  async createRule(createRuleDto: CreateRuleDto): Promise<number> {
    // Extract necessary information from the DTO
    const { main, rules, invitations } = await this.ruleConverter.toEntity(createRuleDto);

    // Save main rule entity
    const savedMain = await RuleMainEntity.save(main);

    // Save rule sub entities
    const savedRules = await RuleSubEntity.save(rules);

    // Save rule invitation entities
    const savedInvitations = await RuleInvitationEntity.save(invitations);

    // Return response
    return savedMain.id;
  }
}
