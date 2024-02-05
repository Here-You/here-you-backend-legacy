import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { RuleService } from 'src/rule/rule.service';
import { MemberController } from './member.controller';
import { MemberListConverter } from './member.list.converter';
import { UserService } from 'src/user/user.service';
import { RuleConverter } from 'src/rule/rule.converter';

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberListConverter, RuleService, UserService, RuleConverter],
})
export class MemberModule {}
