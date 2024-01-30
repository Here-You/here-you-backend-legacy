// signature.entity.ts

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { HomeSignatureDto } from './dto/home-signature.dto';
import { CreateSignatureDto } from './dto/create-signature.dto';

@Entity()
export class SignatureEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  liked_cnt: number;

  @OneToMany(() => UserEntity, (owner) => owner.id)
  owner: UserEntity[];

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
    newSignature: CreateSignatureDto,
  ): Promise<SignatureEntity> {
    try {
      const { title } = newSignature;

      const signature: SignatureEntity = new SignatureEntity();
      signature.title = newSignature.title;

      return await signature.save();
    } catch (error) {
      throw new Error('Failed to create Signature');
    }
  }
}
