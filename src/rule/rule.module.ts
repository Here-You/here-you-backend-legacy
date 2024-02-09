import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { S3UtilService } from "../utils/S3.service";

@Module({
  controllers: [RuleController],
  providers: [RuleService, S3UtilService],
})
export class RuleModule {}
