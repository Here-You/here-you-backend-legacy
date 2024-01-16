import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfileImageEntity } from './user.profile.image.entity';
import { UserFollowingEntity } from './user.following.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text' })
  bio: string;

  @Column()
  age: number;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE', 'UNKNOWN'] })
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';

  @Column({ type: 'enum', enum: ['KAKAO', 'GOOGLE'] })
  oauthType: 'KAKAO' | 'GOOGLE';

  @Column()
  oauthToken: string;

  @OneToOne(() => UserProfileImageEntity, profileImage => profileImage.user)
  profileImage: UserProfileImageEntity;

  @OneToMany(() => UserFollowingEntity, following => following.user)
  following: UserFollowingEntity[];

  @OneToMany(() => UserFollowingEntity, followed => followed.followUser)
  follower: UserFollowingEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}