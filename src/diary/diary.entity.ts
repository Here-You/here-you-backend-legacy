import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @Column()
  place: string;

  @JoinColumn()
  @ManyToOne(() => LocationEntity)
  location: LocationEntity;

  @Column({
    type: 'enum',
    enum: ['CLOUDY', 'RAINY', 'SNOWY', 'PARTLY_CLOUDY', 'SUNNY'],
  })
  weather: 'CLOUDY' | 'RAINY' | 'SNOWY' | 'PARTLY_CLOUDY' | 'SUNNY';

  @Column({
    type: 'enum',
    enum: ['ANGRY', 'SAD', 'SMILE', 'HAPPY', 'SHOCKED'],
  })
  mood: 'ANGRY' | 'SAD' | 'SMILE' | 'HAPPY' | 'SHOCKED';

  @Column({ type: 'mediumtext' })
  content: string;

  @OneToMany(() => DiaryImageEntity, (image) => image.diary)
  images: DiaryImageEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
