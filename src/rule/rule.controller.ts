import { Controller, Post, Body, Param } from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';

@Controller('mate/rule')
export class RuleController {
  constructor(
    private readonly ruleCreateService: RuleService,
  ) {}

  @Post('/write/:userId')
  async createRule(@Body() createRuleDto: CreateRuleDto, @Param('userId') userId: number) {
    return this.ruleCreateService.createRule(createRuleDto, userId);
  }

}