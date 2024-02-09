import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { RuleService } from 'src/rule/rule.service';
import { MemberController } from './member.controller';
import { UserService } from 'src/user/user.service';
import { S3UtilService } from '../utils/S3.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService, RuleService, UserService, S3UtilService],
})
export class MemberModule {}
