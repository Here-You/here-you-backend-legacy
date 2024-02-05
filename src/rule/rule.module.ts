import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { RuleConverter } from './rule.converter';

@Module({
  controllers: [RuleController],
  providers: [RuleService, RuleConverter],
})
export class RuleModule {}
