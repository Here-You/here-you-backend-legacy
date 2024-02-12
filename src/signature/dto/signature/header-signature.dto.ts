// header-signature.dto.ts

export class HeaderSignatureDto{
  _id: number         // 시그니처 아이디
  title: string;      // 시그니처 제목
  is_liked: boolean;  // 해당 시그니처 좋아요 여부
  like_cnt: number;   // 좋아요 개수
  date: string;         // 발행일
}