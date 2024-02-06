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

  //사진 URL 저장
  static async createDiaryImg(diary, ImgUrl: string) {
    const diaryImg = new DiaryImageEntity();
    diaryImg.imageUrl = ImgUrl;
    diaryImg.diary = diary.id;
    console.log(diaryImg.diary);
    await diaryImg.save();
  }
  //사진 URL 불러오기
  static async findExistImgUrl(diary: DiaryEntity) {
    const imgUrl = await DiaryImageEntity.findOne({
      where: { diary: { id: diary.id } },
    });
    return imgUrl;
  }
}
