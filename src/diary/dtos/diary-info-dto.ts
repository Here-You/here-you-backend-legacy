import { IsString, IsDateString, IsEnum } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { DiaryEntity } from '../models/diary.entity';

export class CreateDiaryInfoDto extends PickType(DiaryEntity, [
  'title',
  'place',
  'weather',
  'mood',
  'content',
  'image',
]) {}
