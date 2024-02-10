// mate-profile-response.dto.ts

export class MateProfileResponseDto {
  _id : number;
  image: string;
  nickname: string;
  introduction: string;
  is_followed: boolean;

  followerCnt: number;
  followingCnt: number;
}