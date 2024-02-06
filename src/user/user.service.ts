import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { UserEntity } from './user.entity';
import { IReqUser, IUserProfile } from './user.dto';
import { UserProfileImageEntity } from './user.profile.image.entity';
import { ResponseDto } from '../response/response.dto';
import { ResponseCode } from '../response/response-code.enum';
import { UserFollowingEntity } from './user.following.entity';
import { UserSearchDto} from "./user.search.dto";

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

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
    console.log(email, password);
    const user = await UserEntity.findOne({
      where: {
        email: email.toString() ?? '',
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 403);
    }

    // if (!this._comparePassword(password, user.password)) {
    //   throw new HttpException('Invalid credentials', 403);
    // }

    return {
      success: true,
      token: this._generateToken({
        id: user.id,
      }),
    };
  }

  async checkIfFollowing(
    user: UserEntity,
    targetUserId: number,
  ): Promise<boolean> {
    // user가 targetUser를 팔로우하고 있는지 확인

    const followingArray = user.following || [];

    const isFollowing = followingArray.some(
      (following) => following.followUser.id === targetUserId,
    );

    return isFollowing;
  }

  async findUserById(userId: number): Promise<UserEntity> {
    try {
      const user: UserEntity = await UserEntity.findOne({
        where: { id: userId },
      });
      return user;
    } catch (error) {
      console.log('Error on findUserById: ', error);
      throw error;
    }
  }

  async getProfileImage(userId: number) {
    try {
      const profileImageEntity = await UserProfileImageEntity.findOne({
        where: { user: { id: userId } },
      });

      console.log('겟프로필이미지: ', profileImageEntity);
      return profileImageEntity;

    } catch (error) {
      console.log('Error on getProfileImage: ' + error);
    }
  }

  async updateUserProfile(userId: number, profile: Partial<IUserProfile>) {
    try {
      const user = await UserEntity.findOne({
        where: {
          id: Number(userId),
        },
      });

      if (profile.introduction !== undefined) {
        user.introduction = profile.introduction;
      }
      if (profile.nickname !== undefined) {
        // Todo: 닉네임 중복 체크를 트랜잭션으로 처리하라
        const existingNickname = await UserEntity.count({
          where: {
            nickname: profile.nickname.toString(),
          },
        });

        if (existingNickname > 0) {
          return new ResponseDto(
            ResponseCode.NICKNAME_DUPLICATION,
            false,
            '중복된 닉네임 존재',
            null,
          );
        }

        user.nickname = profile.nickname;
      }

      await user.save();

      return new ResponseDto(
        ResponseCode.UPDATE_PROFILE_SUCCESS,
        true,
        '추가정보 입력 성공',
        null,
      );
    } catch (error) {
      this.logger.error(error);

      if (error instanceof HttpException) {
        throw error;
      }
      return new ResponseDto(
        ResponseCode.INTERNAL_SERVEr_ERROR,
        false,
        '서버 내부 오류',
        null,
      );
    }
  }

  async getFollowingList(userId: number) {
    try {
      const userFollowingEntity = await UserFollowingEntity.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      return userFollowingEntity;
    } catch (error) {
      console.log('Error on getFollowingList: ' + error);
    }
  }

  async getFollowerList(userId: number) {
    try {
      const userFollowerEntity = await UserFollowingEntity.find({
        where: { followUser: { id: userId } },
        relations: ['user'],
      });
      return userFollowerEntity;
    } catch (error) {
      console.log('Error on getFollowingList: ' + error);
    }
  }
  async updateUserVisibility(
    userId: number,
    visibility: 'PUBLIC' | 'PRIVATE' | 'MATE',
  ) {
    try {
      const user = await UserEntity.findOne({
        where: {
          id: Number(userId),
        },
      });

      user.visibility = visibility;
      await user.save();

      return new ResponseDto(
        ResponseCode.UPDATE_PROFILE_SUCCESS,
        true,
        '공개범위 설정 성공',
        null,
      );
    } catch (error) {
      this.logger.error(error);

      if (error instanceof HttpException) {
        throw error;
      }
      return new ResponseDto(
        ResponseCode.INTERNAL_SERVEr_ERROR,
        false,
        '서버 내부 오류',
        null,
      );
    }
  }

  async deleteAccount(userId: number) {
    try {
      const user = await UserEntity.findOne({
        where: {
          id: Number(userId),
        },
      });

      await user.softRemove();

      return new ResponseDto(
        ResponseCode.DELETE_ACCOUNT_SUCCESS,
        true,
        '탈퇴 성공',
        null,
      );
    } catch (error) {
      this.logger.error(error);

      if (error instanceof HttpException) {
        throw error;
      }
      return new ResponseDto(
        ResponseCode.INTERNAL_SERVEr_ERROR,
        false,
        '서버 내부 오류',
        null,
      );
    }
  }

  async findFollowingMates(userId: number) {
    try {
      // userId에 해당하는 유저가 팔로우하고 있는 메이트 목록 리턴
      const followingMates = await UserEntity.find({
        where: {
          follower: { user: { id: userId } },
        },
      });
      return followingMates;
    } catch (error) {
      console.log('Error on findFollowingMates: ', error);
      throw error;

    }
  }

  async getSearchResult(userId: number, searchTerm: string) : Promise<UserSearchDto[]> {
    // 현재 로그인한 유저 객체
    const user = await this.findUserById(userId);
    console.log('현재 로그인한 유저 아이디 : ', user.id)

    console.log(searchTerm);

    // 검색 결과로 보여줄 유저 객체 리스트
    const mates  = await UserEntity.find({
      where: [
           {name: searchTerm}, {nickname: searchTerm},
      ],
      relations : [ 'profileImage', 'following', 'follower' ],
    });
    console.log(mates);

    // dto 리스트 생성
    const results : UserSearchDto[] = await Promise.all(mates.map(async (mate) => {
      const userSearchDto = new UserSearchDto();
      userSearchDto.mateId = mate.id;
      userSearchDto.nickName = mate.nickname;
      userSearchDto.introduction = mate.introduction;
      userSearchDto.followerCnt = mate.follower.length;
      userSearchDto.followingCnt = mate.following.length;
      userSearchDto.image = mate.profileImage.imageKey;
      userSearchDto.isFollowing = await this.checkIfFollowing(user, mate.id);

      return userSearchDto;
    }));

    console.log('검색 결과 : ', results);

    return results;
  }
}
