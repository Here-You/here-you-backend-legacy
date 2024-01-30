// signature.entity.ts

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SignatureEntity } from './signature.entity';
import {PageSignatureDto} from '../dto/page-signature.dto';

@Entity()
export class SignaturePageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pageNum: number;

  @Column({ type: 'mediumtext' })
  content: string;

  @Column()
  location: string;

  @Column()
  image: string;

  @ManyToOne(() => SignatureEntity,
    (signature) => signature.signaturePages)
  @JoinColumn({name: 'signature_id'})
  signature: SignatureEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async saveSignaturePages(
    pageSignatureDto:PageSignatureDto,
    signature:SignatureEntity):Promise<SignaturePageEntity> {

    const signaturePage:SignaturePageEntity = new SignaturePageEntity();

    signaturePage.signature = signature;
    signaturePage.content = pageSignatureDto.content;
    signaturePage.image = pageSignatureDto.image; // base64 이미지 서버에 올려야
    signaturePage.location = pageSignatureDto.location;
    signaturePage.pageNum = pageSignatureDto.page;

    return await signaturePage.save();

  }
}
