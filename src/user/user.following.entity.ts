import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class UserFollowingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => UserEntity, (user) => user.following)
  user: UserEntity;

  @JoinColumn()
  @ManyToOne(() => UserEntity, (user) => user.follower)
  followUser: UserEntity;
}
