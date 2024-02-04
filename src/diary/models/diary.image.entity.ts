import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiaryEntity } from './diary.entity';

@Entity()
export class DiaryImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumtext' })
  imageUrl: string;

  @JoinColumn()
  @OneToOne(() => DiaryEntity, (diary) => diary.image)
  diary: DiaryEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async createDiaryImg(diary, ImgUrl: string) {
    const diaryImg = new DiaryImageEntity();
    diaryImg.imageUrl = ImgUrl;
    diaryImg.diary = diary.id;
    console.log(diaryImg.diary);
    await diaryImg.save();
  }
}
