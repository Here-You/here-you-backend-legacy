// signature.like.entity.ts

import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SignatureEntity } from './signature.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity()
export class SignatureLikeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SignatureEntity,
    (signature) => signature.likes)
  @JoinColumn({name: 'signature_id'})
  signature: SignatureEntity;

  @ManyToOne(() => UserEntity,
    (user) => user.likes)
  @JoinColumn({name: 'user_id'})
  user: UserEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async createLike(signature: SignatureEntity, loginUser: UserEntity) {
    try{
      const signatureLike = new SignatureLikeEntity();
      signatureLike.signature = signature;
      signatureLike.user = loginUser;
      const signatureLikeEntity = await signatureLike.save();
      console.log("sigLike created: ", signatureLikeEntity);

    }catch(error){
      console.error('Error on likeSignature: ', error);
      throw new Error('Failed to like Signature');
    }
  }

  static async findSignatureLikes(signatureId: number) {
    return await SignatureLikeEntity.find({
      where:{
        signature:{id: signatureId},
        user: { isQuit: false }         // 탈퇴한 유저의 좋아요는 가져오지 않음
      },
      relations: ['user', 'signature'],
    })
  }
}
