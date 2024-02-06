// signature.entity.ts

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SignatureEntity } from './signature.entity';
import { PageSignatureDto } from '../dto/page-signature.dto';

@Entity()
export class SignaturePageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  page: number;

  @Column({ type: 'mediumtext' })
  content: string;

  @Column()
  location: string;

  @Column()
  image: string;

  @ManyToOne(() => SignatureEntity, (signature) => signature.signaturePages)
  @JoinColumn({ name: 'signature_id' })
  signature: SignatureEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;


  static async findThumbnail(signatureId: number) {
    // 각 시그니처의 첫 번째 페이지의 이미지 가져오기
    try {
      const firstPage = await SignaturePageEntity.findOne({
        where: {
          signature: { id: signatureId },
          page: 1,
        },
      });

      console.log("썸네일 이미지: ",firstPage.image);
      return firstPage.image;

    } catch (error) {
      console.log('Error on findThumbnail: ', error);
      throw error;
    }
  }

  static async findSignaturePages(signatureId: number) {
    const pages: SignaturePageEntity[] = await SignaturePageEntity.find({
      where: {
        signature: { id: signatureId },
      },
    });

    return pages;
  }
}
