import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RuleConverter } from 'src/rule/rule.converter';
import { RuleService } from 'src/rule/rule.service';

@Module({
  controllers: [UserController],
  providers: [UserService, RuleConverter, RuleService],
})
export class UserModule {}
