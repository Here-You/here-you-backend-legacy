import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { RuleConverter } from './rule.converter';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [],
  controllers: [RuleController],
  providers: [RuleService, RuleConverter, UserModule],
})
export class RuleModule {}
