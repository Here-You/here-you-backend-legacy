import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { DiaryImageEntity } from './diary.image.entity';
import { LocationEntity } from '../../location/location.entity';

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

  @OneToOne(() => DiaryImageEntity, (image) => image.diary, {
    nullable: true,
    cascade: true,
  })
  image: DiaryImageEntity;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
