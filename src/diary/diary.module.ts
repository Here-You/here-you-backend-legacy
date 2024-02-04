import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { S3Module } from 'src/utils/S3.module';

@Module({
  imports: [S3Module],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
