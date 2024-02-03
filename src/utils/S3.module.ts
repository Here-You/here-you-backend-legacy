import { Module } from '@nestjs/common';
import { S3UtilService } from './S3.service';

@Module({
  providers: [S3UtilService],
  exports: [S3UtilService],
})
export class S3Module {}
