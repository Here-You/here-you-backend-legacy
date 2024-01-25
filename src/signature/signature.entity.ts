import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { SignaturePageEntity } from './signature.page.entity';

  @Entity()
  export class SignatureEntity extends BaseEntity {
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
  
    @OneToMany(() => SignaturePageEntity, following => following.user)
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