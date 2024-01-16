import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlaceTagEntity } from './place.tag.entity';
import { PlaceImageEntity } from './place.image.entity';

@Entity()
export class PlaceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => PlaceTagEntity, tag => tag.place)
  tags: PlaceTagEntity[];

  @OneToMany(() => PlaceImageEntity, image => image.place)
  images: PlaceImageEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}