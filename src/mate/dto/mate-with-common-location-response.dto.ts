// mate-with-common-location.dto.ts

import { MateRecommendProfileDto } from './mate-recommend-profile.dto';

export class MateWithCommonLocationResponseDto {
  location: string;
  userName: string; // #112 로그인한 사용자 닉네임 추가
  mateProfiles: MateRecommendProfileDto[];
}
