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
  liked_cnt: number;

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

  /*
  async findMySignature(userId: number): Promise<HomeSignatureDto[]> {
    const signatures = await this.createQueryBuilder('signature')
      .leftJoinAndSelect('signature.owner', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    //결과를 HomeSignatureDto로 매핑
    const result: HomeSignatureDto[] = signatures.map((signature) => ({
      title: signature.title,
      date: signature.created,
      // 페이지 1장 사진 추가해야
    }));

    return result;
  }
  */

  static async createSignature(
    createSignatureDto: CreateSignatureDto,
  ): Promise<SignatureEntity> {
    try {
      const signature: SignatureEntity = new SignatureEntity();
      signature.title = createSignatureDto.title;

      // 현재 로그인한 사용자 아이디로 수정해야함
      const user: UserEntity = await UserEntity.findOne({ where: { id: 1 }});

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
}
