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
import { UserProfileImageEntity } from './user.profile.image.entity';
import { UserFollowingEntity } from './user.following.entity';
import { SignatureEntity } from '../signature/domain/signature.entity';
import { SignatureLikeEntity } from '../signature/domain/signature.like.entity';
import { RuleInvitationEntity } from '../rule/domain/rule.invitation.entity';
import { CommentEntity } from 'src/comment/domain/comment.entity';

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

  @Column()
  nickname: string;

  @Column({ type: 'text' })
  introduction: string;

  @Column()
  age: number;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE', 'UNKNOWN'] })
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';

  @Column({ type: 'enum', enum: ['KAKAO', 'GOOGLE'] })
  oauthType: 'KAKAO' | 'GOOGLE';

  @Column()
  oauthToken: string;

  @OneToOne(() => UserProfileImageEntity, (profileImage) => profileImage.user)
  profileImage: UserProfileImageEntity;

  @OneToMany(() => UserFollowingEntity, (following) => following.user)
  following: UserFollowingEntity[];

  @OneToMany(() => UserFollowingEntity, (followed) => followed.followUser)
  follower: UserFollowingEntity[];

  @OneToMany(() => SignatureEntity, (signature) => signature.user)
  signatures: SignatureEntity[];

  @OneToMany(() => SignatureLikeEntity, (signatureLike) => signatureLike.signature)
  likes: SignatureLikeEntity[];

  @OneToMany(() => RuleInvitationEntity, (invitation) => invitation.inviter)
  invitationsSent: RuleInvitationEntity[];

  @OneToMany(() => RuleInvitationEntity, (invitation) => invitation.invited)
  invitationsReceived: RuleInvitationEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
