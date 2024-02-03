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
import { UserEntity } from '../../user/user.entity';
import { DiaryImageEntity } from './diary.image.entity';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
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

  @OneToOne(() => DiaryImageEntity, (image) => image.diary, {
    nullable: true,
    cascade: true,
  })
  image: DiaryImageEntity;

  @OneToOne(() => ScheduleEntity, (schedule) => schedule.diary)
  @JoinColumn({ name: 'scheduleId' })
  schedule: ScheduleEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  /*일지 생성하기*/
  static async createDiary(schedule) {
    const diary = new DiaryEntity();
    diary.schedule = schedule.id;
    await diary.save();
  }
  /*일지 작성하기*/
  static async postDiary(schedule, diaryInfo: PostDiaryDto) {
    const diary = new DiaryEntity();
    diary.title = diaryInfo.title;
    diary.place = diaryInfo.place;
    diary.weather = diaryInfo.weather;
    diary.mood = diaryInfo.mood;
    diary.content = diaryInfo.content;
    diary.schedule = schedule.id;

    return await diary.save();
  }
}
