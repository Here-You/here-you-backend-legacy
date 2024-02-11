// mate-profile-response.dto.ts

export class MateProfileResponseDto {
  _id : number;
  image: string;
  nickname: string;
  introduction: string;
  is_followed: boolean;

  signatures: number;   // 시그니처 개수
  follower: number;     // 팔로워 수
  following: number;    // 팔로잉 수
}