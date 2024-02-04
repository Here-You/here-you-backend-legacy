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
    const { main, rules, invitations } = await this.ruleConverter.toEntity(createRuleDto);

    const savedMain = await RuleMainEntity.save(main);

    const savedRules = await RuleSubEntity.save(rules);

    const savedInvitations = await RuleInvitationEntity.save(invitations);

    return savedMain.id;
  }
}
