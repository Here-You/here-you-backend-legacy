import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseResponse } from 'src/response/response.status';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { UserEntity } from '../../user/user.entity';
import { JourneyEntity } from 'src/journey/model/journey.entity';
import { DiaryImageEntity } from './diary.image.entity';
import { PostDiaryDto } from '../dtos/post-diary.dto';

@Entity()
export class DiaryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => UserEntity)
  author: UserEntity;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  place: string;

  @Column({
    type: 'enum',
    enum: ['CLOUDY', 'RAINY', 'SNOWY', 'PARTLY_CLOUDY', 'SUNNY'],
    nullable: true,
  })
  weather: 'CLOUDY' | 'RAINY' | 'SNOWY' | 'PARTLY_CLOUDY' | 'SUNNY';

  @Column({
    type: 'enum',
    enum: ['ANGRY', 'SAD', 'SMILE', 'HAPPY', 'SHOCKED'],
    nullable: true,
  })
  mood: 'ANGRY' | 'SAD' | 'SMILE' | 'HAPPY' | 'SHOCKED';

  @Column({ nullable: true, type: 'mediumtext' })
  content: string;

  @OneToOne(() => DiaryImageEntity, (image) => image.diary, {})
  image: DiaryImageEntity;

  @JoinColumn()
  @OneToOne(() => ScheduleEntity, (schedule) => schedule.diary)
  schedule: ScheduleEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  //일지 생성하기
  static async createDiary(scheduleId, diaryInfo) {
    const diary = new DiaryEntity();
    diary.title = diaryInfo.title;
    diary.place = diaryInfo.place;
    diary.weather = diaryInfo.weather;
    diary.mood = diaryInfo.mood;
    diary.content = diaryInfo.content;

    diary.schedule = scheduleId;

    return await diary.save();
  }
  //일지 수정하기
  static async updateDiary(diaryId, diaryInfo: PostDiaryDto) {
    const diary = await this.findExistDiary(diaryId);
    diary.title = diaryInfo.title;
    diary.place = diaryInfo.place;
    diary.weather = diaryInfo.weather;
    diary.mood = diaryInfo.mood;
    diary.content = diaryInfo.content;

    return await diary.save();
  }

  //세부 일정 삭제하기
  static async deleteDiary(diary) {
    return await DiaryEntity.softRemove(diary);
  }

  //일지 조회하기
  static async findExistDiary(diaryId) {
    const diary = await DiaryEntity.findOne({
      where: { id: diaryId },
    });
    if (!diary) {
      throw new NotFoundException(BaseResponse.DIARY_NOT_FOUND);
    }
    return diary;
  }

  //scheduleId로 일지 조회하기
  static async findExistDiaryByScheduleId(schedule) {
    const diary = await DiaryEntity.findOne({
      where: { schedule: { id: schedule.id } },
    });
    return diary;
  }
}
