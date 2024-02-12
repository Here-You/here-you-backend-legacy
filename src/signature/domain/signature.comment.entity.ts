// signature.comment.entity.ts

import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SignatureEntity } from './signature.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity()
export class SignatureCommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SignatureEntity,
    (signature) => signature.comments)
  @JoinColumn()
  signature: SignatureEntity;

  @ManyToOne(() => UserEntity,
    (user) => user.signatureComments)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => SignatureCommentEntity,
    (childComment) => childComment.parentComment)
  @JoinColumn()
  childComments: SignatureCommentEntity[];

  @ManyToOne(() => SignatureCommentEntity,
    (parentComment) => parentComment.childComments)
  @JoinColumn()
  parentComment: SignatureCommentEntity;

  @Column()
  content: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}