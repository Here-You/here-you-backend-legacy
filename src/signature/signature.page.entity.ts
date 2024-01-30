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
import { SignatureEntity } from './signature.entity';

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

  @OneToMany(() => SignatureEntity, (signature) => signature.id)
  signature: SignatureEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
