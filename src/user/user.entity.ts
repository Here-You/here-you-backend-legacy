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
import { JourneyEntity } from 'src/journey/model/journey.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  nickname: string;

  @Column({ type: 'text', nullable: true })
  bio: string;
  @Column({ type: 'text' })
  introduction: string;

  @Column()
  age: number;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE', 'UNKNOWN'], nullable: true })
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';

  @Column({ type: 'enum', enum: ['KAKAO', 'GOOGLE'], nullable: true })
  oauthType: 'KAKAO' | 'GOOGLE';

  @Column({ nullable: true })
  oauthToken: string;

  @OneToOne(() => UserProfileImageEntity, (profileImage) => profileImage.user)
  profileImage: UserProfileImageEntity;

  @OneToMany(() => UserFollowingEntity, (following) => following.user)
  following: UserFollowingEntity[];

  @OneToMany(() => UserFollowingEntity, (followed) => followed.followUser)
  follower: UserFollowingEntity[];

  @OneToMany(() => SignatureEntity, (signature) => signature.user)
  signatures: SignatureEntity[];

  @OneToMany(
    () => SignatureLikeEntity,
    (signatureLike) => signatureLike.signature,
  )
  likes: SignatureLikeEntity[];

  @OneToMany(() => RuleInvitationEntity, (invitation) => invitation.inviter)
  invitationsSent: RuleInvitationEntity[];

  @OneToMany(() => RuleInvitationEntity, (invitation) => invitation.invited)
  invitationsReceived: RuleInvitationEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => JourneyEntity, (journey) => journey.user)
  journeys: JourneyEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
