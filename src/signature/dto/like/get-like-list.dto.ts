// get-like-list.dto.ts

import { LikeProfileDto } from './like-profile.dto';

export class GetLikeListDto {
  liked: number; // 좋아요 개수
  profiles: LikeProfileDto[]; // 좋아요한 사용자 프로필 리스트
}
