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
import { CreateDiaryDto } from '../dtos/create-diary.dto';

@Entity()
export class DiaryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => UserEntity)
  author: UserEntity;

  @Column()
  title: string;

  @Column()
  place: string;

  @Column({
    type: 'enum',
    enum: ['CLOUDY', 'RAINY', 'SNOWY', 'PARTLY_CLOUDY', 'SUNNY'],
  })
  weather: 'CLOUDY' | 'RAINY' | 'SNOWY' | 'PARTLY_CLOUDY' | 'SUNNY';

  @Column({
    type: 'enum',
    enum: ['ANGRY', 'SAD', 'SMILE', 'HAPPY', 'SHOCKED'],
  })
  mood: 'ANGRY' | 'SAD' | 'SMILE' | 'HAPPY' | 'SHOCKED';

  @Column({ type: 'mediumtext' })
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

  static async createDiary(schedule, diaryInfo: CreateDiaryDto) {
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
