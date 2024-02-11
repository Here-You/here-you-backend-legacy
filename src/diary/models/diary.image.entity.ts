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
import { S3UtilService } from 'src/utils/S3.service';

@Entity()
export class DiaryImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumtext' })
  imageUrl: string;

  @JoinColumn()
  @OneToOne(() => DiaryEntity, (diary) => diary.image, {
    onDelete: 'CASCADE',
  })
  diary: DiaryEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  //사진 URL 저장
  static async createDiaryImg(diary: DiaryEntity, ImgUrl: string) {
    const diaryImg = new DiaryImageEntity();
    diaryImg.imageUrl = ImgUrl;
    diaryImg.diary = diary;
    console.log(diaryImg.diary);
    await diaryImg.save();
  }

  //사진 URL 수정
  static async updateDiaryImg(diary: DiaryEntity, ImgUrl: string) {
    const diaryImg = await DiaryImageEntity.findOne({
      where: { diary: { id: diary.id } },
    });
    diaryImg.imageUrl = ImgUrl;
    diaryImg.diary = diary;
    await diaryImg.save();
  }

  //사진 URL 불러오기
  static async findExistImgUrl(diary: DiaryEntity) {
    const imgUrl = await DiaryImageEntity.findOne({
      where: { diary: { id: diary.id } },
    });
    return imgUrl;
  }

  //세부 일정 삭제하기
  static async deleteDiaryImg(diaryImg) {
    return await DiaryImageEntity.remove(diaryImg);
  }
}
