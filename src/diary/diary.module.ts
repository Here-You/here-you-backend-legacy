import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { AwsS3Module } from 'aws-s3/aws-s3.module';

@Module({
  imports: [AwsS3Module],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
