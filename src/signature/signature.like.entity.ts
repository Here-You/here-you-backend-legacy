// signature.like.entity.ts

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
import SignatureEntity from './signature.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity()
export class SignatureLikeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => SignatureEntity, (signature) => signature.id)
  signature: SignatureEntity[];

  @OneToMany(() => UserEntity, (user) => user.id)
  user: UserEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
