import { HttpException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { UserEntity } from './user.entity';
import { IReqUser } from './user.dto';
import { UserFollowingEntity } from './user.following.entity';
import { UserProfileImageEntity } from './user.profile.image.entity';

@Injectable()
export class UserService {
  private _hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  private _comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  private _generateToken(payload: IReqUser) {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  }

  async Login(email: string, password: string) {
    const user = await UserEntity.findOne({
      where: {
        email: email.toString() ?? '',
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 403);
    }

    if (!this._comparePassword(password, user.password)) {
      throw new HttpException('Invalid credentials', 403);
    }

    return {
      success: true,
      token: this._generateToken({
        id: user.id,
      }),
    };
  }

  async checkIfFollowing(user: UserEntity, targetUserId: number): Promise<boolean> {
    // user가 targetUser를 팔로우하고 있는지 확인

    const followingArray = user.following||[];

    const isFollowing = followingArray.some(
      (following) => following.followUser.id === targetUserId);

    return isFollowing;
  }

  async findUserById(userId: number): Promise<UserEntity> {
    try{
      const user:UserEntity = await UserEntity.findOne({
        where: { id: userId },
      });
      return user;

    }catch (error){
      console.log("Error on findUserById: ", error);
      throw error;
    }
  }

  async getProfileImage(userId: number) {
    try{
      const profileImageEntity = await UserProfileImageEntity.findOne({
        where:{ user:{ id: userId } }
      });

      console.log("겟프로필이미지: ",profileImageEntity);
      return profileImageEntity;

    }catch (error){
      console.log("Error on getProfileImage: "+error);
    }
  }
}
