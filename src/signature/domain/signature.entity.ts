// signature.entity.ts

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { HomeSignatureDto } from '../dto/home-signature.dto';
import { CreateSignatureDto } from '../dto/create-signature.dto';
import { UserService } from '../../user/user.service';
import { SignaturePageEntity } from './signature.page.entity';
import { SignatureLikeEntity } from './signature.like.entity';

@Entity()
export class SignatureEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({default:0})
  liked: number;

  @ManyToOne(() => UserEntity,
    (user) => user.signatures)
  @JoinColumn({ name: 'user_id'})
  user: UserEntity;

  @OneToMany(() => SignaturePageEntity,
    (signaturePage) => signaturePage.signature)
  signaturePages: SignaturePageEntity[];

  @OneToMany(() => SignatureLikeEntity,
    (signatureLike) => signatureLike.signature)
  likes: SignatureLikeEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async formatDateString(date: Date): Promise<string> {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  }

  static async createSignature(
    createSignatureDto: CreateSignatureDto,
  ): Promise<SignatureEntity> {
    try {
      const signature: SignatureEntity = new SignatureEntity();
      signature.title = createSignatureDto.title;

      // 현재 로그인한 사용자 아이디로 수정해야함
      const user: UserEntity = await UserEntity.findOne({
        where: { id: 1 }
      });

      if(!user){
        throw new Error('User not found');
      }
      else{
        console.log("user name: "+ user.name);
        signature.user = user;

        return await signature.save();

      }
    } catch (error) {
      console.error('Error creating Signature:', error);
      throw new Error('Failed to create Signature');
    }
  }

  static async findMySignature(user_id: number):Promise<HomeSignatureDto[]> {
    const mySignatureList:HomeSignatureDto[] = [];
    const signatures = await SignatureEntity.find({
      where: { user: { id: user_id} },
    });

    for(const signature of signatures){
      const homeSignature:HomeSignatureDto = new HomeSignatureDto();

      homeSignature.id = signature.id;
      homeSignature.title = signature.title;
      homeSignature.date = signature.created;
      homeSignature.image = await SignaturePageEntity.findThumbnail(signature.id);

      mySignatureList.push(homeSignature);
    }
    return mySignatureList;
  }

  static async findSignatureById(signatureId: number): Promise<SignatureEntity> {
    const signature:SignatureEntity = await SignatureEntity.findOne({
      where: { id: signatureId },
      relations: ['user'] // user 관계를 포함
    });

    return signature;
  }
}
