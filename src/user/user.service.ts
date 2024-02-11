import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import fetch from 'node-fetch';
import { UserEntity } from './user.entity';
import { IReqUser, IUserProfile } from './user.dto';
import { UserProfileImageEntity } from './user.profile.image.entity';
import { ResponseDto } from '../response/response.dto';
import { ResponseCode } from '../response/response-code.enum';
import { UserFollowingEntity } from './user.following.entity';
import { RuleInvitationEntity } from '../rule/domain/rule.invitation.entity';

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

  private objectToQueryString(obj: Record<string, unknown>) {
    return Object.entries(obj)
      .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
      .join('&');
  }

  private async getKakaoToken(code: string, redirectUrl: string) {
    const response = await fetch(`https://kauth.kakao.com/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: this.objectToQueryString({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: redirectUrl,
        code,
      }),
    });

    return await response.json();
  }

  private async getKakaoInformation(accessToken: string) {
    const response = await fetch(
      `https://kapi.kakao.com/v2/user/me?${this.objectToQueryString({
        property_keys: JSON.stringify([
          'kakao_account.profile',
          'kakao_account.email',
          'kakao_account.name',
        ]),
      })}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    return await response.json();
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

  async SNSLogin(type: 'KAKAO' | 'GOOGLE', code: string, redirectUrl: string) {
    if (type === 'KAKAO') {
      // 인가 코드 받기
      const authToken = await this.getKakaoToken(code, redirectUrl);
      if (authToken.error) {
        return new ResponseDto(
          ResponseCode.UNKNOWN_AUTHENTICATION_ERROR,
          false,
          '인가 코드가 유효하지 않습니다',
          null,
        );
      }

      // 사용자 정보 받기
      const kakaoInfo = await this.getKakaoInformation(authToken.access_token);

      const userId = kakaoInfo.id;
      const userProfile = kakaoInfo.kakao_account.profile;
      const userEmail = kakaoInfo.kakao_account.email;

      // 사용자 정보로 DB 조회
      let userEntity = await UserEntity.findOne({
        where: {
          oauthType: 'KAKAO',
          oauthToken: userId.toString(),
        },
        relations: {
          profileImage: true,
        },
      });

      let isNewUser = false;
      if (!userEntity) {
        isNewUser = true;
        userEntity = new UserEntity();
        userEntity.oauthType = 'KAKAO';
        userEntity.oauthToken = userId.toString();

        userEntity.introduction = '';
        userEntity.visibility = 'PUBLIC';
        userEntity.name = '';
        userEntity.age = 0;
      }

      userEntity.email = userEmail;
      userEntity.password = '';
      userEntity.nickname = userProfile?.nickname;

      // Todo: 프로필 이미지 저장하기
      await userEntity.save();

      return {
        status: 200,
        success: true,
        message: '로그인 성공',
        token: this._generateToken({
          id: userEntity.id,
        }),
        register_required: isNewUser,
      };
    } else if (type === 'GOOGLE') {
      // Todo
    } else {
      return new ResponseDto(
        ResponseCode.INTERNAL_SERVEr_ERROR,
        false,
        '잘못된 요청입니다',
        null,
      );
    }
  }

  async checkIfFollowing(
    user: UserEntity,
    targetUserId: number,
  ): Promise<boolean> {
    // user가 targetUser를 팔로우하고 있는지 확인

    const isFollowing = await UserFollowingEntity.findOne({
      where: {
        user: { id: user.id },
        followUser: { id: targetUserId },
      },
    });

    if (isFollowing) return true;
    else return false;
  }

  async findUserById(userId: number): Promise<UserEntity> {
    try {
      const user: UserEntity = await UserEntity.findOne({
        where: { id: userId },
        relations: ['profileImage'],
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
      return await UserFollowingEntity.find({
        where: { user: { id: userId } },
        relations: { followUser: { profileImage: true } },
      });
    } catch (error) {
      console.log('Error on getFollowingList: ' + error);
    }
  }

  async getFollowerList(userId: number) {
    try {
      return await UserFollowingEntity.find({
        where: { followUser: { id: userId } },
        relations: { user: { profileImage: true } },
      });
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

  /*
  async getSearchResult(userId: number, searchTerm: string) : Promise<UserSearchDto[]> {
    // 현재 로그인한 유저 객체
    const user = await this.findUserById(userId);
    console.log('현재 로그인한 유저 아이디 : ', user.id)

    console.log(searchTerm);

    // 검색 결과로 보여줄 유저 객체 리스트
    const mates  = await UserEntity.find({
      where: [
          {name: Like(`%${searchTerm}%`)},
          {nickname: Like(`%${searchTerm}%`)},
      ],
      relations : {
        profileImage: true,
        following: true,
        follower: true,
      }
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

   */

  async isAlreadyFollowing(userId: number, followingId: number) {
    const userEntity = await this.findUserById(userId);
    const followingEntity = await this.findUserById(followingId);
    console.log('현재 로그인한 사용자 : ', userEntity.id);
    console.log('팔로우 대상 사용자 : ', followingEntity.id);

    const isFollowing = await UserFollowingEntity.findOne({
      where: {
        user: { id: userId },
        followUser: { id: followingId },
      },
    });

    // 팔로우 관계 : true 반환
    return !!isFollowing;
  }

  async checkAlreadyMember(user: UserEntity, ruleID: number) {
    const rule = await RuleInvitationEntity.findOne({
      where: { member: { id: user.id }, rule: { id: ruleID } },
    });
    // 이미 규칙 멤버인 경우 : true 반환
    console.log('rule : ', rule);
    return !!rule;
  }
}
