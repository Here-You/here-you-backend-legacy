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

  @OneToOne(() => DiaryEntity, (diary) => diary.image)
  diaryId: DiaryEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async createDiaryImg(diaryId, ImgUrl: string) {
    const diaryImg = new DiaryImageEntity();
    diaryImg.imageUrl = ImgUrl;
    diaryImg.diaryId = diaryId;
    await diaryImg.save();
  }
}
