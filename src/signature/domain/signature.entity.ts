// signature.entity.ts

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  JoinColumn,
  ManyToOne,
  MoreThan,
  OneToMany,
  PrimaryGeneratedColumn,
  RemoveEvent,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CreateSignatureDto } from '../dto/signature/create-signature.dto';
import { SignaturePageEntity } from './signature.page.entity';
import { SignatureLikeEntity } from './signature.like.entity';
import { SignatureCommentEntity } from './signature.comment.entity';
@Entity()
@EventSubscriber()
export class SignatureEntity
  extends BaseEntity
  implements EntitySubscriberInterface<SignatureLikeEntity>
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 0 })
  liked: number;

  @ManyToOne(() => UserEntity, (user) => user.signatures)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(
    () => SignaturePageEntity,
    (signaturePage) => signaturePage.signature,
  )
  signaturePages: SignaturePageEntity[];

  @OneToMany(
    () => SignatureLikeEntity,
    (signatureLike) => signatureLike.signature,
  )
  likes: SignatureLikeEntity[];

  @OneToMany(
    () => SignatureCommentEntity,
    (signatureComment) => signatureComment.signature,
  )
  comments: SignatureCommentEntity[];

  listenTo() {
    return SignatureLikeEntity;
  }

  // SignatureLikeEntity 삽입 이벤트에 대한 이벤트 리스너
  beforeInsert(event: InsertEvent<SignatureLikeEntity>): void {
    this.updateLikedCount(event.entity, 1);
  }

  // SignatureLikeEntity 삭제 이벤트에 대한 이벤트 리스너
  beforeRemove(event: RemoveEvent<SignatureLikeEntity>): void {
    this.updateLikedCount(event.entity, -1);
  }

  // 변경된 값에 따라 liked 카운트 업데이트
  private updateLikedCount(entity: SignatureLikeEntity, change: number): void {
    this.liked += change;
    this.save(); // 업데이트된 liked 카운트를 데이터베이스에 저장
  }

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  static async formatDateString(date: Date): Promise<string> {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  }

  static async createSignature(
    createSignatureDto: CreateSignatureDto,
    userId: number,
  ): Promise<SignatureEntity> {
    try {
      const signature: SignatureEntity = new SignatureEntity();
      signature.title = createSignatureDto.title;

      const user: UserEntity = await UserEntity.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      } else {
        console.log('user name: ' + user.name);
        signature.user = user;

        return await signature.save();
      }
    } catch (error) {
      console.error('Error creating Signature:', error);
      throw new Error('Failed to create Signature');
    }
  }

  static async findSignatureById(
    signatureId: number,
  ): Promise<SignatureEntity> {
    const signature: SignatureEntity = await SignatureEntity.findOne({
      where: { id: signatureId },
      relations: ['user'], // user 포함
    });

    return signature;
  }

  static async findRecentSignatures(): Promise<SignatureEntity[]> {
    // [1] 기준이 되는 일주일 전 날짜
    const sevenDaysAgo: Date = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    console.log(sevenDaysAgo);

    // [2] 오늘로부터 일주일 안으로 쓰여진 시그니처 가져오기
    const recentSignatures = await SignatureEntity.find({
      where: {
        created: MoreThan(sevenDaysAgo),
        user: { isQuit: false }, // 탈퇴한 사용자의 시그니처는 추천에서 제외
      },
      relations: ['user'], // user 포함
    });

    return recentSignatures;
  }

  static async findNewSignaturesByUser(userId: number) {
    // [1] 기준이 되는 20일 전 날짜
    const twentyDaysAgo: Date = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
    console.log(twentyDaysAgo);

    // [2] 20일 전에 쓰인 메이트의 최신 시그니처 가져오기
    const signatures = await SignatureEntity.find({
      where: { user: { id: userId }, created: MoreThan(twentyDaysAgo) },
      relations: ['user'], // user 포함
    });
    return signatures;
  }
}
