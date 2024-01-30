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
}
