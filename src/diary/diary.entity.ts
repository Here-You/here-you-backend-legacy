import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DiaryImageEntity } from './diary.image.entity';
import { LocationEntity } from '../location/location.entity';

@Entity()
export class DiaryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => UserEntity)
  author: UserEntity;

  @Column()
  title: string;

  @JoinColumn()
  @ManyToOne(() => LocationEntity)
  location: LocationEntity;

  @Column({ type: 'enum', enum: ['SUNNY', 'RAINY', 'SNOWY', 'CLOUDY'] })
  weather: 'SUNNY' | 'RAINY' | 'SNOWY' | 'CLOUDY';

  @Column({ type: 'enum', enum: ['HAPPY', 'SAD', 'ANGRY', 'SHOCKED', 'SLEEPY', 'WINK'] })
  mood: 'HAPPY' | 'SAD' | 'ANGRY' | 'SHOCKED' | 'SLEEPY' | 'WINK';

  @Column({ type: 'mediumtext' })
  detail: string;

  @OneToMany(() => DiaryImageEntity, (image) => image.diary)
  images: DiaryImageEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}