import { Module } from '@nestjs/common';
import { S3UtilService } from './S3.service';
import { S3UtilController } from './S3.controller';

@Module({
  controllers: [S3UtilController],
  providers: [S3UtilService],
  exports: [S3UtilService],
})
export class S3Module {}
