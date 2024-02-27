import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class UserProfileImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @OneToOne(() => UserEntity, (user) => user.profileImage)
  user: UserEntity;

  @Column()
  imageKey: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async findImageKey(userEntity): Promise<string> {
    const imageEntity: UserProfileImageEntity =
      await UserProfileImageEntity.findOneOrFail({
        where: { user: userEntity },
      });
    const imageKey = imageEntity.imageKey;

    return imageKey;
  }
}
