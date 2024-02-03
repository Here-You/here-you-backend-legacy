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

  @JoinColumn({ name: 'diaryId' })
  @OneToOne(() => DiaryEntity, (diary) => diary.image)
  diary: DiaryEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async createDiaryImg(diaryId, ImgUrl: string) {
    const diaryImg = new DiaryImageEntity();
    diaryImg.imageUrl = ImgUrl;
    diaryImg.diary = diaryId;
    await diaryImg.save();
  }
}
